package org.unisys.sellingpoint.dao.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.unisys.sellingpoint.dao.IGenericDAO;
import org.unisys.sellingpoint.exception.WorkbenchException;

import com.mongodb.MongoException;

public class MongoDAOImpl<T> implements IGenericDAO<T> {

	private final static Logger LOG = LoggerFactory.getLogger(MongoDAOImpl.class);
	@Autowired
	protected MongoTemplate mongoTemplate;

	public MongoTemplate getMongoTemplate() {
		return mongoTemplate;
	}

	public void setMongoTemplate(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	public T save(T entity) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>save()");
		}
		try {
			mongoTemplate.insert(entity);
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--save() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException(exception.getMessage(), exception);
		}
		if (LOG.isDebugEnabled()) {
			LOG.debug("<<save()");
		}
		return entity;
	}

	public Boolean delete(T entity) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>delete()");
		}
		mongoTemplate.remove(entity);
		return null;
	}

	public T find(String entityId, Class clazz) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>find()");
		}
		return (T) mongoTemplate.findById(entityId, clazz);
	}

	public List<T> findAll(Class entityClass) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>findAll()");
		}
		return mongoTemplate.findAll(entityClass);
	}

}
