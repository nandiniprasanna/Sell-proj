package org.unisys.sellingpoint.dao;

import java.util.List;

import org.unisys.sellingpoint.exception.WorkbenchException;

public interface IGenericDAO<T> {

	public T save(T entity) throws WorkbenchException;

	public Boolean delete(T entity) throws WorkbenchException;

	public T find(String entityId, Class<T> clazz) throws WorkbenchException;

	public List<T> findAll(Class<T> entityClass) throws WorkbenchException;
}
