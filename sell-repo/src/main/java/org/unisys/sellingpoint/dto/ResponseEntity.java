/*
 * Copyright 2016 (C) Unisys Software Private Ltd.
 * 
 * Created on : Feb 16, 2016
 * File Name  : ResponseEntity.java
 * Author     : Kirtish Kulkarni (kirtish.kulkarni@in.unisys.com)
 *
 */

package org.unisys.sellingpoint.dto;

import java.io.Serializable;
import java.util.Map;

public class ResponseEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5243021673659821686L;

	private int statusCode;

	private String message;

	private Object result;

	private Map<String, String> errors;
	
	private Map<String, String> others;

	public ResponseEntity(int statusCode, String message) {
		this.statusCode = statusCode;
		this.message = message;
	}
	
	public ResponseEntity(int statusCode, String message,Object result) {
		this.statusCode = statusCode;
		this.message = message;
		this.result = result;
	}
	public ResponseEntity(int statusCode, String message, Map<String,String> others) {
		this.statusCode = statusCode;
		this.message = message;
		this.others = others;
	}
	public ResponseEntity(int statusCode, String message,Object result,Map<String,String> errorMessages) {
		this.statusCode = statusCode;
		this.message = message;
		this.result = result;
		this.errors = errorMessages;
	}

	public ResponseEntity(int statusCode, String message,Object result,Map<String,String> errorMessages, Map<String,String> others) {
		this.statusCode = statusCode;
		this.message = message;
		this.result = result;
		this.errors = errorMessages;
		this.others = others;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Map<String, String> getErrors() {
		return errors;
	}

	public void setErrors(Map<String, String> errors) {
		this.errors = errors;
	}

	public Map<String, String> getOthers() {
		return others;
	}

	public void setOthers(Map<String, String> others) {
		this.others = others;
	}
	
	

}
