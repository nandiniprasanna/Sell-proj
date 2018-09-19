package org.unisys.sellingpoint.dao.admin.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.transaction.annotation.Transactional;
import org.unisys.sellingpoint.dao.admin.IUserDao;
import org.unisys.sellingpoint.dao.impl.MongoDAOImpl;
import org.unisys.sellingpoint.domain.User;
import org.unisys.sellingpoint.exception.WorkbenchException;

import com.mongodb.MongoException;

public class UserDaoImpl extends MongoDAOImpl<User> implements IUserDao {
	private final static Logger LOG = LoggerFactory.getLogger(UserDaoImpl.class);

	public User checkDuplicateUser(User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>checkDuplicateUser()");
		}
		List<User> users = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("userName").is(user.getUserName()));
			users = mongoTemplate.find(new Query(query), User.class);
			if (!users.isEmpty())
				return users.get(0);
			else
				return null;
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--checkDuplicateUser() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
	}
	
	public User checkDuplicateEmail(User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>checkDuplicateEmail()");
		}
		List<User> users = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("email").is(user.getEmail()));
			users = mongoTemplate.find(new Query(query), User.class);
			if (!users.isEmpty())
				return users.get(0);
			else
				return null;
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--checkDuplicateEmail() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
	}

	@Transactional
	public User editUser(User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>editUser()");
		}
		try {
			Update update = new Update();
			update.set("firstName", user.getFirstName());
			update.set("lastName", user.getLastName());
			update.set("userName", user.getUserName());
			update.set("password", user.getPassword());
			update.set("email", user.getEmail());
			update.set("contact", user.getContact());
			update.set("systemRoles", user.getSystemRoles());
			update.set("count", user.getCount());
			update.set("lock", user.isLock());

			mongoTemplate.updateFirst(new Query().addCriteria(Criteria.where("_id").is(user.getId())), update,
					User.class);
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--editUser() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		if (LOG.isDebugEnabled()) {
			LOG.debug("<<editUser()");
		}
		return user;
	}

	@Transactional
	public User deleteUser(User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>deleteUser()");
		}
		try {
			Update update = new Update();
			update.set("deleted", true);

			mongoTemplate.updateFirst(new Query().addCriteria(Criteria.where("_id").is(user.getId())), update,
					User.class);
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--deleteUser() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		if (LOG.isDebugEnabled()) {
			LOG.debug("<<deleteUser()");
		}
		return user;
	}

	public User getUserById(String id) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserById()");
		}
		User user = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("id").is(id), Criteria.where("deleted").is(false));
			user = mongoTemplate.findOne(new Query(query), User.class);

		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--getUserById() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		return user;
	}

	public List<User> getAllUser() throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getAllUser()");
		}
		List<User> users = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("deleted").is(false));
			users = mongoTemplate.find(new Query(query), User.class);
			return users;
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--getAllUser() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
	}

	public User userAuthentication(User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>userAuthentication()");
		}
		List<User> users = null;
		User existing = getUserByName(user.getUserName());
		if(existing != null){
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("userName").is(user.getUserName()),
					Criteria.where("password").is(user.getPassword()), Criteria.where("deleted").is(false), Criteria.where("lock").is(false));
			users = mongoTemplate.find(new Query(query), User.class);
			if (!users.isEmpty()){
				existing.setCount(0);
				editUser(existing);
				return users.get(0);}
			else{
				existing.setCount(existing.getCount()+1);
				editUser(existing);
				if(existing.getCount()>3){
					existing.setLock(true);
					existing.setCount(0);
					editUser(existing);
				}
				return null;
			}
			
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--userAuthentication() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		}
		return  null;
	}
	public User getUserByName(String name) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserByName()");
		}
		User user = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("userName").is(name), Criteria.where("deleted").is(false));
			user = mongoTemplate.findOne(new Query(query), User.class);

		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--getUserByName() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		return user;
	}
	public User getUserByEmail(String email) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserByEmail()");
		}
		User user = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("email").is(email), Criteria.where("deleted").is(false));
			user = mongoTemplate.findOne(new Query(query), User.class);

		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--getUserByEmail() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		return user;
	}
	public  List<User> getUserBySysRole(String role) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserByRole()");
		}
		List<User> user = null;
		try {
			Criteria query = new Criteria();
			query.andOperator(Criteria.where("systemRoles.roleName").is(role), Criteria.where("deleted").is(false));
			user = mongoTemplate.find(new Query(query), User.class);

		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--getUserByRole() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		return user;
	}
}
