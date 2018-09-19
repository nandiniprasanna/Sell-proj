package org.unisys.sellingpoint.dao.admin.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.unisys.sellingpoint.dao.admin.IUserLogDao;
import org.unisys.sellingpoint.dao.impl.MongoDAOImpl;
import org.unisys.sellingpoint.domain.UserLog;
import org.unisys.sellingpoint.exception.WorkbenchException;

import com.mongodb.MongoException;

public class UserLogDaoImpl extends MongoDAOImpl<UserLog> implements IUserLogDao {
	private final static Logger LOG = LoggerFactory.getLogger(UserLogDaoImpl.class);	
	
	public UserLog findUserLogByUserName(String userName) throws WorkbenchException {
		if(LOG.isDebugEnabled()){
			LOG.debug(">>findUserLogByUserName()");
		}
		try{
			return mongoTemplate.findOne(new Query().addCriteria(Criteria.where("userName").is(userName)),
					UserLog.class);
		}catch (MongoException exception) {
			if(LOG.isErrorEnabled()){
				LOG.error("--findUserLogByUserName() > "+exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
	}
}
