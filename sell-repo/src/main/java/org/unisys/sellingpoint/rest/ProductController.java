package org.unisys.sellingpoint.rest;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.unisys.sellingpoint.commons.CPULoadGenerator;
import org.unisys.sellingpoint.dao.admin.IProductDao;
import org.unisys.sellingpoint.dao.admin.IUserLogDao;
import org.unisys.sellingpoint.domain.Product;
import org.unisys.sellingpoint.domain.UserLog;
import org.unisys.sellingpoint.dto.ResponseEntity;
import org.unisys.sellingpoint.exception.WorkbenchException;

@Path("/api/product")
public class ProductController {

	private final static Logger LOG = LoggerFactory.getLogger(ProductController.class);

	@POST
	@Path("/save")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity saveProduct(@Context HttpServletRequest req, Product product) throws WorkbenchException {
		
		try {
			productDao.save(product);
			
			/* Enumeration<String> vars=req.getHeaderNames(); 
			 while(vars.hasMoreElements()) {
				 String h=vars.nextElement();
			 System.out.println(h+"===>"+req.getHeader(h));
			 LOG.info(h+"===>"+req.getHeader(h));
			 }
			 */
			UserLog userLog= createUserLog("Adding Product" , req.getHeader("remoteuser"), "Adding Product:"+product.getName(),req.getHeader("remoteemail"));
			LOG.info(userLog.toString());
		} catch (Exception _ex) {
			/*if (LOG.isErrorEnabled()) {
				LOG.error("--saveProduct() > " + _ex.getMessage(), _ex);
			}*/
			return new ResponseEntity(Response.Status.CREATED.getStatusCode(),
					"Unable to add Product with name : " + product.getName());
		}
		return new ResponseEntity(Response.Status.CREATED.getStatusCode(),
				"Product added successfully with name : " + product.getName());
	}

	@POST
	@Path("/update")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ResponseEntity updateProduct(@Context HttpServletRequest req, Product product) throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>updateProduct()");
		}
		try {
			productDao.editProduct(product);
		} catch (Exception _ex) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--updateProduct() > " + _ex.getMessage(), _ex);
			}
			return new ResponseEntity(Response.Status.CREATED.getStatusCode(),
					"Unable to add Product with name : " + product.getName());
		}
		return new ResponseEntity(Response.Status.CREATED.getStatusCode(),
				"Product added successfully with name : " + product.getName());
	}

	@Path("/allproducts")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Product> getAllProducts() throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>getAllProducts()");
		}
		return productDao.findAll(Product.class);
	}

	@Path("/cpuload")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void increaseLoad() throws WorkbenchException {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>increaseLoad()");
		}
		int numCore = 2;
        int numThreadsPerCore = 2;
        double load = 0.8;
        final long duration = 100000;
        for (int thread = 0; thread < numCore * numThreadsPerCore; thread++) {
            new CPULoadGenerator("Thread" + thread, load, duration).start();
        }
	}
	private UserLog createUserLog(String action, String userName, String message,String email) throws IOException, WorkbenchException {
		UserLog userlog = new UserLog();
		userlog.setUserName(userName);
		userlog.setLogDateTime(new Date());
		userlog.setAction(action);
		userlog.setMessage(message);
		userlog.setEmail(email);
		return userlog = getUserlogDao().save(userlog);
	}

	@Autowired
	IUserLogDao userlogDao;

	public IUserLogDao getUserlogDao() {
		return userlogDao;
	}

	public void setUserlogDao(IUserLogDao userlogDao) {
		this.userlogDao = userlogDao;
	}

	@Autowired
	IProductDao productDao;
}
