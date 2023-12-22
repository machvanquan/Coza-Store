package com.poly.dto;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dao.OrdersDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/OrderDTO")
public class OrderDTORestController {
	
	@Autowired
	OrdersDAO ordersDAO;
	
	@GetMapping("cash")
	public List<OrderDTO> getTienmat() {
		return ordersDAO.getTienmat();
	}
	
	@GetMapping("cash/{startDate}/{endDate}")
	public List<OrderDTO> pushTienmat(@PathVariable("startDate") Date startDate, @PathVariable("endDate") Date endDate) {
		return ordersDAO.pushTienmat(startDate, endDate);
	}
	
	@GetMapping("paypal")
	public List<OrderDTO> getChuyenkhoan() {
		return ordersDAO.getChuyenkhoan();
	}
	
	@GetMapping("paypal/{startDate}/{endDate}")
	public List<OrderDTO> pushChuyenkhoan(@PathVariable("startDate") Date startDate, @PathVariable("endDate") Date endDate) {
		return ordersDAO.pushChuyenkhoan(startDate, endDate);
	}
	

}
