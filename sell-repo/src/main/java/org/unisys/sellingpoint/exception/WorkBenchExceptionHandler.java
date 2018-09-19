/**
 * 
 */
package org.unisys.sellingpoint.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

/**
 * @author KulkarnK
 *
 */

@Provider
public class WorkBenchExceptionHandler implements ExceptionMapper<WorkbenchException> {

	public Response toResponse(WorkbenchException ex) {
		ErrorMessage errorMessage = new ErrorMessage(Response.Status.EXPECTATION_FAILED.getStatusCode(), ex.toString());
		StringWriter writer = new StringWriter();
		ex.printStackTrace(new PrintWriter(writer));
		errorMessage.setDetails(writer.toString());
		return Response.status(Response.Status.OK.getStatusCode()).entity(errorMessage).build();

	}

}
