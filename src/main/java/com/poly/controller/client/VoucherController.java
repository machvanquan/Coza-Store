package com.poly.controller.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.poly.dao.Account_voucherDAO;
import com.poly.dao.AccountsDAO;
import com.poly.dao.VouchersDAO;
import com.poly.entity.Account_voucher;
import com.poly.entity.Accounts;
import com.poly.entity.Vouchers;
import com.poly.service.AccountService;

@Controller
@RequestMapping("home")
public class VoucherController {

	@Autowired
	VouchersDAO vouchersDAO;

	@Autowired
	Account_voucherDAO account_voucherDAO;

	@Autowired
	AccountsDAO accountsDAO;
	
	@Autowired
	AccountService accountService;

	@GetMapping("vouchers/list")
	public String vouchersALL(Model model) {
		List<Vouchers> vouchers = vouchersDAO.findAll();
		model.addAttribute("vouchers", vouchers);
		return "user/voucher/listVoucher";

	}

	@GetMapping("vouchers")
	public String vouchers(Model model) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		model.addAttribute("voucher", account_voucherDAO.findByUsername(username));
		model.addAttribute("profile", accountService.findById(username));
		return "user/voucher/myVoucher";
	}

	@RequestMapping("vouchers/add/{id}")
	public String vouchersCreate(Model model, @PathVariable("id") String id) {
		 String username = SecurityContextHolder.getContext().getAuthentication().getName();
		    
		    Accounts accounts = accountsDAO.getById(username);
		    Vouchers voucher = vouchersDAO.getById(id);
		    
		    if (!account_voucherDAO.existsByAccountsAndVouchers(accounts, voucher)) {
		        Account_voucher acc = new Account_voucher();
		        acc.setAccounts(accounts);
		        acc.setVouchers(voucher);
		        account_voucherDAO.save(acc);
		    }
		return "redirect:/home/vouchers";
	}

}
