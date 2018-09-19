package org.unisys.sellingpoint.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.UnknownHostException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.unisys.sellingpoint.commons.EmailSender;
import org.unisys.sellingpoint.commons.WorkbenchConstants;
import org.unisys.sellingpoint.dao.admin.INotificationDao;
import org.unisys.sellingpoint.dao.admin.IUserDao;
import org.unisys.sellingpoint.dao.admin.IUserLogDao;
import org.unisys.sellingpoint.domain.Notification;
import org.unisys.sellingpoint.domain.User;
import org.unisys.sellingpoint.domain.UserLog;
import org.unisys.sellingpoint.dto.ResponseEntity;
import org.unisys.sellingpoint.exception.WorkbenchException;

@Path("/api/user")
public class UserController {

	private final static Logger LOG = LoggerFactory.getLogger(UserController.class);

	@POST
	@Path("/save")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity saveUser(@Context HttpServletRequest req, User user) throws WorkbenchException, IOException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>saveUser()");
		}
		User users = userDao.checkDuplicateUser(user);
		User userExist = userDao.checkDuplicateEmail(user);
		if (users != null) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--saveUser() > User with name " + user.getUserName() + " already exists.");
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"User with name :" + user.getUserName() + " already exists .", user);
		}
		if (userExist != null) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--saveUser() > User with Email " + user.getEmail() + " already exists.");
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"User with email :" + user.getEmail() + "  already exists .", user);
		}

		if (user.getPassword() != null && !user.getPassword().isEmpty()) {
			user.setPassword(DigestUtils.md5Hex(user.getPassword() + WorkbenchConstants.MD5_SALT_STRING));
			userDao.save(user);
		} else {

			userDao.save(user);
			String userName = req.getHeader("remoteuser");
			// createUserLog("Save User", userName);
		}

		/** To create password for the created user * **/
		Notification notify = new Notification();
		notify.setCreationDate(new Date());
		notify.setUserName(user.getUserName());
		notify.setEmail(user.getEmail());
		notify.setNotificationType(WorkbenchConstants.PASSWORD_CREATED_SUBJECT);
		notify = getNotificationDao().save(notify);
		// Send email
		try {
			createPasswordEmail(req, user, notify.getId());
		} catch (UnknownHostException _ex) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--saveUser() > " + _ex.getMessage(), _ex);
			}
		}
		if (LOG.isDebugEnabled()) {
			LOG.debug("<<saveUser() > User saved Successfully");
		}
		return new ResponseEntity(Response.Status.CREATED.getStatusCode(),
				"User Created successfully with name : " + user.getUserName());
		// }

	}

	@Path("/update")
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity updateUser(@Context HttpServletRequest req, User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>updateUser()");
		}
		try {
			User use = getUserDao().find(user.getId(), User.class);
			if (null != use && use.getId() != null) {
				// user.setPassword(DigestUtils.md5Hex(user.getPassword() +
				// WorkbenchConstants.MD5_SALT_STRING));

				Map<String, String> paramMap = new HashMap<String, String>();
				paramMap.put("$NAME", user.getFirstName());
				paramMap.put("$USER_NAME", user.getUserName());
				String body = readEmailFromHtml(WorkbenchConstants.USER_UPDATE_SUCCESS_TMPL, paramMap);

				paramMap.put("$USER_EMAIL", user.getEmail());
				String bodyemail = readEmailFromHtml(WorkbenchConstants.USER_EMAIL_UPDATE_SUCCESS_TMPL, paramMap);
				// String bodyemail =
				// WorkbenchConstants.USER_EMAIL_UPDATE_SUCCESS_TMPL
				// .replace("$USER_NAME",
				// use.getFirstName()).replace("$USER_EMAIL", user.getEmail());
				// String body =
				// WorkbenchConstants.USER_UPDATE_SUCCESS_TMPL.replace("$USER_NAME",
				// user.getFirstName());
				getUserDao().editUser(user);
				String userName = req.getHeader("remoteuser");
				/*
				 * try { //createUserLog("Update Usrer", userName); } catch
				 * (IOException e) { e.printStackTrace(); }
				 */
				if (!user.getEmail().equals(use.getEmail())) {
					EmailSender.sendEmail(WorkbenchConstants.UPDATE_USER_SUBJECT, bodyemail,
							WorkbenchConstants.EMAIL_FROM, use.getEmail());
					EmailSender.sendEmail(WorkbenchConstants.UPDATE_USER_SUBJECT, body, WorkbenchConstants.EMAIL_FROM,
							user.getEmail());
				} else {
					EmailSender.sendEmail(WorkbenchConstants.UPDATE_USER_SUBJECT, body, WorkbenchConstants.EMAIL_FROM,
							user.getEmail());
				}
			} else {
				if (LOG.isErrorEnabled()) {
					LOG.error("--updateUser() > User Not found: " + user.getUserName());
				}
				return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(), "User Not found", user);
			}
			if (LOG.isDebugEnabled()) {
				LOG.debug("<<updateUser()");
			}
			return new ResponseEntity(Response.Status.OK.getStatusCode(), "User updated successfully", user);
		} catch (WorkbenchException _ex) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--updateAccount() > " + _ex.getMessage(), _ex);
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(), _ex.getMessage(), user);
		}
	}

	@Path("/allusers")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<User> getAllUsers() throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getAllUsers()");
		}
		return getUserDao().getAllUser();
	}

	@DELETE
	@Path("/delete/{userId}")
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity deleteUser(@Context HttpServletRequest req, @PathParam("userId") String id)
			throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>deleteUser()");
		}
		User user = getUserDao().getUserById(id);

		if (user == null) {
			if (LOG.isDebugEnabled()) {
				LOG.debug("--deleteUser() > User does not exits with Id " + id);
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"User with id : " + id + "   does not exist", id);
		} else {
			userDao.deleteUser(user);
			String userName = req.getHeader("remoteuser");
			/*
			 * try { createUserLog("Update Usrer", userName,); } catch
			 * (IOException e) { e.printStackTrace(); }
			 */
			// String body
			// =WorkbenchConstants.USER_DELETE_SUCCESS_TMPL.replace("$USER_NAME",user.getFirstName());
			Map<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("$NAME", user.getFirstName());
			paramMap.put("$USER_NAME", user.getUserName());
			String body = readEmailFromHtml(WorkbenchConstants.USER_DELETE_SUCCESS_TMPL, paramMap);
			EmailSender.sendEmail(WorkbenchConstants.DELETE_WBUSER_SUBJECT, body, WorkbenchConstants.EMAIL_FROM,
					user.getEmail());
			if (LOG.isDebugEnabled()) {
				LOG.debug("--deleteUser() > User deleted succesfully");
			}
			return new ResponseEntity(Response.Status.OK.getStatusCode(),
					user.getUserName() + " has been succesfully deleted");
		}
	}

	@Path("/login")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity userLogin(User user) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>");
		}
		UserLog userLog=null;
		user.setPassword(DigestUtils.md5Hex(user.getPassword() + WorkbenchConstants.MD5_SALT_STRING));
		User users = userDao.userAuthentication(user);
		User userByName=userDao.getUserByName(user.getUserName());
		if (users != null && userByName !=null) {
			/*if (LOG.isDebugEnabled()) {
				LOG.debug("<<saveUser() > User is Available");
			}*/
			String message = "User login successfully with User Name : " + user.getUserName();
			try {
				 userLog=createUserLogSuccess("Login", users.getUserName(), users.getEmail(), message);
			} catch (IOException e) {
				e.printStackTrace();
			}
			LOG.info(userLog.toString());

			return new ResponseEntity(Response.Status.OK.getStatusCode(),
					"User is Available with User Name: " + users.getUserName(), users);

		}else if (users == null && userByName !=null) {
			/*if (LOG.isErrorEnabled()) {
				LOG.error("--getUser() > User with This Credintial Not Available .");
			}*/
			String msg = "Password Enter by User is Incorrect.";
			try {
				
				 userLog=createUserLogFail("Login", userByName.getUserName(), userByName.getEmail(), msg);
			} catch (IOException e) {
				e.printStackTrace();
			}
			LOG.info(userLog.toString());
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(), "User Credential is not correct.");	

		}else {
			/*if(LOG.isErrorEnabled()){
				LOG.error("--getUser() > User with This Credintial Not Available .");
			}*/
			String msg = "There is no user with name:" + user.getUserName();
			try {
				  userLog=createUserLogFail("Login", user.getUserName(), "No Email", msg);
			} catch (IOException e) {
				e.printStackTrace();
			}
			LOG.info(userLog.toString());
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"User Credential is not correct.");
		}
		 
	}
	 
	@Path("/getUser/{userName}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public User getUserByName(@PathParam("userName") String userName) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserByName()");
		}
		return getUserDao().getUserByName(userName);
	}

	@Path("/getUserByMail/{email}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public User getUserByEmail(@PathParam("email") String email) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserByEmail()");
		}
		return getUserDao().getUserByEmail(email);
	}

	@Path("/find/{userId}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public User getUser(@PathParam("userId") String id) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUser()");
		}
		return getUserDao().getUserById(id);
	}

	@Path("/getUserByRole/{role}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<User> getUserByRole(@PathParam("role") String role) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getUserByRole()");
		}
		return getUserDao().getUserBySysRole(role);
	}

	@Path("/forgotPassword/{email}")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity forgotPassword(@Context HttpServletRequest req, @PathParam("email") String email) {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>forgotPassword");
		}
		try {
			User user = getUserDao().getUserByEmail(email);

			if (user != null) {
				if (LOG.isDebugEnabled()) {
					LOG.debug("--forgotPassword() > User is Available");
				}
				Notification notify = new Notification();
				notify.setCreationDate(new Date());
				notify.setUserName(user.getUserName());
				notify.setEmail(user.getEmail());
				notify.setNotificationType(WorkbenchConstants.RESET_PASSWORD_SUBJECT);

				notify = getNotificationDao().save(notify);
				// Send email
				restPasswordEmail(req, user, notify.getId());

				return new ResponseEntity(Response.Status.OK.getStatusCode(),
						"Email sent with link to reset password for email: " + user.getEmail());
			} else {
				if (LOG.isErrorEnabled()) {
					LOG.error("--forgotPassword() > User with this email not available.");
				}
				return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
						"User with given email not available.");
			}
		} catch (UnknownHostException e) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--forgotPassword() > Exception in sending forgot password email.");
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"Exception in sending forgot password email.");
		} catch (WorkbenchException ex) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--forgotPassword() > Exception in sending forgot password email.");
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"Exception in sending forgot password email.");
		}
	}

	@Path("/verifyNotification/{id}")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity verifyNotification(@Context HttpServletRequest req, @PathParam("id") String id)
			throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>resetPassword");
		}
		Notification note = getNotificationDao().find(id, Notification.class);

		if (note != null) {
			if (LOG.isDebugEnabled()) {
				LOG.debug("<<verifyNotification() > Notification avalable");
			}
			Date currentDate = new Date();

			Calendar c = Calendar.getInstance();
			c.setTime(note.getCreationDate());
			c.add(Calendar.DATE, 1);
			Date expireDate = c.getTime();

			if (expireDate.compareTo(currentDate) > 0) {
				return new ResponseEntity(Response.Status.OK.getStatusCode(), note.getUserName(), note.getEmail());
			} else {
				getNotificationDao().delete(note);
				return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
						"Link is  Invalid/expired, Please re-generate the request.");
			}

		} else {
			if (LOG.isErrorEnabled()) {
				LOG.error("--verifyNotification() > User with This email Not Available.");
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(),
					"Link is  Invalid/expired, Please re-generate the request.");
		}
	}

	@Path("/resetPassword")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity resetPassword(@Context HttpServletRequest req, @QueryParam("id") String notifyId, User user)
			throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>resetPassword");
		}
		try {
			if (user != null) {
				User existingUser = getUserDao().getUserByName(user.getUserName());
				if (existingUser != null) {
					existingUser
							.setPassword(DigestUtils.md5Hex(user.getPassword() + WorkbenchConstants.MD5_SALT_STRING));
					getUserDao().editUser(existingUser);
					// delete notification
					Notification note = getNotificationDao().find(notifyId, Notification.class);
					getNotificationDao().delete(note);
					// String body
					// =WorkbenchConstants.RESET_PASSWORD_SUCCESS_TMPL.replace("$USER_NAME",
					// existingUser.getFirstName()).replace("$USERID",
					// existingUser.getUserName());
					Map<String, String> paramMap = new HashMap<String, String>();
					paramMap.put("$NAME", existingUser.getFirstName());
					paramMap.put("$USER_NAME", existingUser.getUserName());
					String body = readEmailFromHtml(WorkbenchConstants.RESET_PASSWORD_SUCCESS_TMPL, paramMap);
					EmailSender.sendEmail(WorkbenchConstants.RESET_PASSWORD_SUBJECT, body,
							WorkbenchConstants.EMAIL_FROM, existingUser.getEmail());
					if (LOG.isDebugEnabled()) {
						LOG.debug("<<resetPassword()");
					}
					return new ResponseEntity(Response.Status.OK.getStatusCode(),
							"Password got reset successfully for user name: " + user.getUserName(), user);
				} else {
					if (LOG.isErrorEnabled()) {
						LOG.error("--resetPassword() > User not found with user name: " + user.getUserName());
					}
					return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(), "User Not found", user);
				}
			} else {
				if (LOG.isErrorEnabled()) {
					LOG.error("--resetPassword() > No User found in request");
				}
				return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(), "No User found in request",
						user);
			}

		} catch (WorkbenchException _ex) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--resetPassword() > " + _ex.getMessage(), _ex);
			}
			return new ResponseEntity(Response.Status.BAD_REQUEST.getStatusCode(), _ex.getMessage(), user);
		}
	}

	private void restPasswordEmail(HttpServletRequest req, User user, String notifyId)
			throws WorkbenchException, UnknownHostException {
		String hostName = req.getRemoteHost();
		int remotePort = req.getServerPort();

		/*
		 * if(hostName.equalsIgnoreCase("127.0.0.1")){ InetAddress iAddress =
		 * InetAddress.getLocalHost(); hostName =
		 * iAddress.getCanonicalHostName(); //hostName = iAddress.getHostName();
		 * }
		 */
		String msg = WorkbenchConstants.HTTP_STRING + hostName + ":" + remotePort + req.getContextPath()
				+ WorkbenchConstants.RESET_PASSWORD_URL + notifyId;
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("$NAME", user.getFirstName());
		paramMap.put("$RESET_URL", msg);
		String body = readEmailFromHtml(WorkbenchConstants.FORGOT_PASSWORD_TMPL, paramMap);
		// String body =
		// WorkbenchConstants.FORGOT_PASSWORD_TMPL.replace("$USER_NAME",
		// user.getFirstName()).replace("$RESET_URL", msg);
		EmailSender.sendEmail(WorkbenchConstants.RESET_PASSWORD_SUBJECT, body, WorkbenchConstants.EMAIL_FROM,
				user.getEmail());
	}

	private void createPasswordEmail(HttpServletRequest req, User user, String notifyId)
			throws WorkbenchException, UnknownHostException {
		String hostName = req.getRemoteHost();
		int remotePort = req.getServerPort();
		String msg = WorkbenchConstants.HTTP_STRING + hostName + ":" + remotePort + req.getContextPath()
				+ WorkbenchConstants.RESET_PASSWORD_URL + notifyId;

		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("$NAME", user.getFirstName());
		paramMap.put("$RESET_URL", msg);
		paramMap.put("$USER_NAME", user.getUserName());
		String body = readEmailFromHtml(WorkbenchConstants.CREATE_PASSWORD_TMPL, paramMap);
		// String body =
		// WorkbenchConstants.CREATE_PASSWORD_TMPL.replace("$USER_NAME",user.getFirstName()).replace("$NEW_USER",
		// user.getUserName()).replace("$RESET_URL", msg);
		EmailSender.sendEmail(WorkbenchConstants.CREATE_PASSWORD_SUBJECT, body, WorkbenchConstants.EMAIL_FROM,
				user.getEmail());
	}

	// Method to replace the values for keys
	protected String readEmailFromHtml(String fileName, Map<String, String> input) throws WorkbenchException {
		String msg = null;
		try {
			msg = readContentFromFile(fileName);
			Set<Entry<String, String>> entries = input.entrySet();
			for (Map.Entry<String, String> entry : entries) {
				msg = msg.replace(entry.getKey().trim(), entry.getValue().trim());
			}
		} catch (Exception exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--readEmailFromHtml() > " + exception.getMessage(), exception);
			}
			throw new WorkbenchException("Exception in reading email template.", exception);
		}
		return msg;
	}

	// Method to read HTML file as a String
	private String readContentFromFile(String fileName) throws IOException {
		String line = null;
		try {
			ClassLoader classLoader = getClass().getClassLoader();
			InputStream stream = classLoader
					.getResourceAsStream(WorkbenchConstants.EMAIL_TEMPLATE_DIR + "/" + fileName + ".html");
			BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
			try {
				line = reader.lines().collect(Collectors.joining("\n"));
			} finally {
				reader.close();
			}
		} catch (IOException ex) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--readContentFromFile() > " + ex.getMessage(), ex);
			}
			throw ex;
		}
		return line;
	}

	private UserLog createUserLogSuccess(String action, String userName, String email, String message)
			throws IOException, WorkbenchException {
		UserLog userlog = new UserLog();
		userlog.setUserName(userName);
		userlog.setLogDateTime(new Date());
		userlog.setAction(action);
		userlog.setEmail(email);
		userlog.setMessage(message);
		return userlog = getUserlogDao().save(userlog);
	}

	private UserLog createUserLogFail(String action, String userName, String email, String message)
			throws IOException, WorkbenchException {
		UserLog userlog = new UserLog();
		userlog.setUserName(userName);
		userlog.setLogDateTime(new Date());
		userlog.setAction(action);
		userlog.setEmail(email);
		userlog.setMessage(message);
		return userlog = getUserlogDao().save(userlog);
	}

	@Autowired
	IUserDao userDao;

	public IUserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}

	@Autowired
	INotificationDao notificationDao;

	public INotificationDao getNotificationDao() {
		return notificationDao;
	}

	public void setNotificationDao(INotificationDao notificationDao) {
		this.notificationDao = notificationDao;
	}

	@Autowired
	IUserLogDao userlogDao;

	public IUserLogDao getUserlogDao() {
		return userlogDao;
	}

	public void setUserlogDao(IUserLogDao userlogDao) {
		this.userlogDao = userlogDao;
	}

}
