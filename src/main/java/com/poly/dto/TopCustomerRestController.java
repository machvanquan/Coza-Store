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
@RequestMapping("/rest/topCustomer")
public class TopCustomerRestController {
	
	@Autowired
	OrdersDAO ordersDAO;
	
	@GetMapping()
	public List<TopCustomerDTO> getAll() {
		return ordersDAO.getTopCustomers();
	}
	
	@GetMapping("{startDate}/{endDate}")
	public List<TopCustomerDTO> pushTopCustomers(@PathVariable("startDate") Date startDate, @PathVariable("endDate") Date endDate) {
		return ordersDAO.pushTopCustomers(startDate, endDate);
	}
	
}
