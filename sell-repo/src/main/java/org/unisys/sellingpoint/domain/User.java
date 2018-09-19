package org.unisys.sellingpoint.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "user")
public class User {

	@Id
	private String id;

	private String firstName;

	private String lastName;

	@Indexed(unique = true)
	private String userName;

	private String password;

	private String email;

	private String contact;

    List<SystemRole> systemRoles;

	private boolean deleted;
	
	private int count;
	
	private boolean lock;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public List<SystemRole> getSystemRoles() {
		return systemRoles;
	}

	public void setSystemRoles(List<SystemRole> systemRoles) {
		this.systemRoles = systemRoles;
	}

	public int getCount() {
		return count;
	}

	public boolean isLock() {
		return lock;
	}

	public void setLock(boolean lock) {
		this.lock = lock;
	}

	public void setCount(int count) {
		this.count = count;
	}

	 


}
