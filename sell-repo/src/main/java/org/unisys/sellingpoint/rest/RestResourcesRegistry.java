
package org.unisys.sellingpoint.rest;

import org.glassfish.jersey.server.ResourceConfig;

public class RestResourcesRegistry extends ResourceConfig{

	public RestResourcesRegistry(){
		packages("org.unisys.sellingpoint.exception");
		packages("org.unisys.sellingpoint.rest");
	}
}
