/*
 * Copyright 2016 (C) Unisys Software Private Ltd.
 * 
 * Created on : Feb 10, 2016 
 * File Name  : WorkbenchException.java
 * Author     : Kirtish Kulkarni (kirtish.kulkarni@in.unisys.com)
 *
 */

package org.unisys.sellingpoint.exception;

public class WorkbenchException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public WorkbenchException(String message) {
		super(message);
	}

	public WorkbenchException(String message, Throwable ex) {
		super(message, ex);
	}

	public WorkbenchException() {
		super();
	}
}
