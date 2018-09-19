package org.unisys.sellingpoint.dao.admin;

import org.unisys.sellingpoint.dao.IGenericDAO;
import org.unisys.sellingpoint.domain.UserLog;
import org.unisys.sellingpoint.exception.WorkbenchException;

public interface IUserLogDao extends IGenericDAO<UserLog> {
	public UserLog findUserLogByUserName(String userName) throws WorkbenchException;
 
}
