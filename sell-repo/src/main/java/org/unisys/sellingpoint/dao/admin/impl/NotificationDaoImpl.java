package org.unisys.sellingpoint.dao.admin.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.unisys.sellingpoint.dao.admin.INotificationDao;
import org.unisys.sellingpoint.dao.impl.MongoDAOImpl;
import org.unisys.sellingpoint.domain.Notification;
import org.unisys.sellingpoint.exception.WorkbenchException;

import com.mongodb.MongoException;

public class NotificationDaoImpl extends MongoDAOImpl<Notification> implements INotificationDao {

	private final static Logger LOG = LoggerFactory.getLogger(NotificationDaoImpl.class);
	
	public Notification findByUserName(String userName) throws WorkbenchException {
		if(LOG.isDebugEnabled()){
			LOG.debug(">>findByUserName()");
		}
		try{
			return mongoTemplate.findOne(new Query().addCriteria(Criteria.where("userName").is(userName)),
					Notification.class);
		}catch (MongoException exception) {
			if(LOG.isErrorEnabled()){
				LOG.error("--findByUserName() > "+exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
	}

}
