package org.unisys.sellingpoint.dao.admin;

import org.unisys.sellingpoint.dao.IGenericDAO;
import org.unisys.sellingpoint.domain.Notification;
import org.unisys.sellingpoint.exception.WorkbenchException;

public interface INotificationDao extends IGenericDAO<Notification> {

	public Notification findByUserName(String userName) throws WorkbenchException;

}
