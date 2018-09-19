package org.unisys.sellingpoint.commons;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.unisys.sellingpoint.exception.WorkbenchException;
 

public class EmailSender {
	
	private final static Logger LOG = LoggerFactory.getLogger(EmailSender.class);
	private static Properties prop = null;
	
	public static void sendEmail(String subject, String mailBody, String from, String to) throws WorkbenchException{
		  
		   //Get the session object, valid up to sending email   
		   Properties properties = new Properties();
		      properties.put("mail.smtp.host",getProperty("smtp.host"));
		      properties.put("mail.smtp.port", getProperty("smtp.port"));
		      Session session = Session.getDefaultInstance(properties);
		   //Compose the message  
		   try {  
		     MimeMessage message = new MimeMessage(session);  
		     message.setFrom(new InternetAddress(from));  
		     message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));  
		     message.setSubject(subject);  
		     message.setContent(mailBody, "text/html");  
		       
		    //send the message  
		     Transport.send(message);  
		     LOG.info("message sent successfully...");  
		   
		     } catch (MessagingException e) {
		    	 throw new WorkbenchException("Exception in sending email", e);
		     }  
		 }  
	 
	 private static void loadProperties() throws IOException {
		 
	        prop = new Properties();
	        String propFileName = "./sellingpoint.properties";
	 
	        InputStream inputStream = EmailSender.class.getClassLoader().getResourceAsStream(propFileName);
	        if(inputStream != null){
	        	prop.load(inputStream);
	        }	        
	        if (inputStream == null) {
	            throw new FileNotFoundException("property file '" + propFileName + "' not found in the classpath");
	        }
	  }
	 
	 public static String getProperty(String key){
		 if(prop == null){
			 try {
				loadProperties();
			} catch (IOException e) {
				if(LOG.isErrorEnabled()){
					LOG.error("IOException in getProperty"+e);
				}
			}
		 }
			 
		return prop.getProperty(key);
	 }
}

// Test ci bulid.
