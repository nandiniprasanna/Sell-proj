/*
 * Copyright 2016 (C) Unisys Software Private Ltd.
 * 
 * Created on : Feb 11, 2016 
 * File Name  : ErrorMessage.java
 * Author     : Kirtish Kulkarni (kirtish.kulkarni@in.unisys.com)
 *
 */

package org.unisys.sellingpoint.exception;

import java.io.Serializable;

public class ErrorMessage implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 977933178592590653L;

	private String message;

	private int statusCode;

	private String details; 
	
	
	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public ErrorMessage() {

	}

	public ErrorMessage(int statusCode, String message) {
		this.statusCode = statusCode;
		this.message = message;
	}

}
