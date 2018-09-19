package org.unisys.sellingpoint.dao.admin.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.unisys.sellingpoint.dao.admin.IProductDao;
import org.unisys.sellingpoint.dao.impl.MongoDAOImpl;
import org.unisys.sellingpoint.domain.Product;

import com.mongodb.MongoException;

public class ProductDaoImpl extends MongoDAOImpl<Product> implements IProductDao {
	private final static Logger LOG = LoggerFactory.getLogger(ProductDaoImpl.class);

	public List<Product> getSellProducts() {
		// TODO Auto-generated method stub
		return null;
	}

	public List<Product> getBuyProducts() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Product editProduct(Product product) throws Exception {
		if (LOG.isDebugEnabled()) {
			LOG.debug(">>editProduct()");
		}
		try {
			Update update = new Update();
			update.set("name", product.getName());
			update.set("description", product.getDescription());
			update.set("price", product.getPrice());
			update.set("forSale", product.isForSale());
			update.set("category", product.getCategory());

			mongoTemplate.updateFirst(new Query().addCriteria(Criteria.where("_id").is(product.getId())), update,
					Product.class);
		} catch (MongoException exception) {
			if (LOG.isErrorEnabled()) {
				LOG.error("--editProduct() > " + exception.getMessage(), exception);
			}
			throw new Exception(exception.getMessage(), exception);
		}
		if (LOG.isDebugEnabled()) {
			LOG.debug("<<editProduct()");
		}

		return product;
	}

}
