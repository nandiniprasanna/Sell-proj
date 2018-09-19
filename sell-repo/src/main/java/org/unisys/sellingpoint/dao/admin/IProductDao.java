package org.unisys.sellingpoint.dao.admin;

import java.util.List;

import org.unisys.sellingpoint.dao.IGenericDAO;
import org.unisys.sellingpoint.domain.Product;

public interface IProductDao extends IGenericDAO<Product>{
	public Product editProduct(Product product) throws Exception;
	public List<Product> getSellProducts();
	public List<Product> getBuyProducts();
	
}