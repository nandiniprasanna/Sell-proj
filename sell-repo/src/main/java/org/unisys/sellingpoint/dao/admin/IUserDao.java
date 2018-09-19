package org.unisys.sellingpoint.dao.admin;

import java.util.List;

import org.unisys.sellingpoint.dao.IGenericDAO;
import org.unisys.sellingpoint.domain.User;
import org.unisys.sellingpoint.exception.WorkbenchException;

public interface IUserDao extends IGenericDAO<User> {

	public User checkDuplicateUser(User user) throws WorkbenchException;

	public User editUser(User user) throws WorkbenchException;

	public User deleteUser(User user) throws WorkbenchException;

	public User getUserById(String id) throws WorkbenchException;

	public List<User> getAllUser() throws WorkbenchException;

	public User userAuthentication(User user) throws WorkbenchException;

	public User getUserByEmail(String email) throws WorkbenchException;

	public User getUserByName(String name) throws WorkbenchException;

	public List<User> getUserBySysRole(String role) throws WorkbenchException;

	public User checkDuplicateEmail(User user) throws WorkbenchException;
}
