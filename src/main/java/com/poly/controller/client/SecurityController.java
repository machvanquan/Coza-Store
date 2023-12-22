package com.poly.controller.client;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.poly.dao.AccountsDAO;
import com.poly.entity.Accounts;
import com.poly.service.AccountService;
import com.poly.utils.OAuth2Service;
import com.poly.utils.ParamService;
import com.poly.utils.SessionService;

@Controller
public class SecurityController {

	@Autowired
	AccountsDAO accountsDAO;

	@Autowired
	AccountService accountService;

	@Autowired
	ParamService paramService;

	@Autowired
	SessionService sessionService;

	@RequestMapping("/security/login/form")
	public String form() {
		return "user/account/login";
	}

	@RequestMapping("/security/login/success")
	public String success(Model model) {
		model.addAttribute("message", "Đăng nhập thành công !");
		return "forward:/home/index";

	}

	@RequestMapping("/security/login/error")
	public String error(Model model) {
		model.addAttribute("message", "Sai thông tin đăng nhập !");
		return "forward:/security/login/form";
	}

	@RequestMapping("/security/logoff/success")
	public String logoff(Model model) {
		model.addAttribute("message", "Đăng xuất thành công !");
		return "forward:/security/login/form";
	}

	@RequestMapping("/security/access/denied")
	public String denied(Model model) {
		model.addAttribute("message", "You do not have access !");
		return "user/account/login";

	}

	@CrossOrigin("*")
	@ResponseBody
	@RequestMapping("/rest/security/authentication")
	public Object getAuthentication(HttpSession session) {
		return session.getAttribute("authentication");
	}

	@Autowired
	OAuth2Service auth2Service;

	@RequestMapping("/oauth2/login/success")
	public String success(OAuth2AuthenticationToken oauth2) {

		String fullname = oauth2.getPrincipal().getAttribute("name");
		String password = Long.toHexString(System.currentTimeMillis());
		String email = oauth2.getPrincipal().getAttribute("email");

		Accounts existingAccount = accountsDAO.findByUsername(fullname);

		if (existingAccount != null) {
			auth2Service.loginFormOAuth2(oauth2);
		} else {

			Accounts acc = new Accounts();
			acc.setUsername(fullname);
			acc.setPassword(password);
			acc.setEmail(email);
			acc.setActive(true);
			acc.setPhoto("avata.png");
			accountsDAO.save(acc);
			auth2Service.loginFormOAuth2(oauth2);
		}
		return "forward:/security/login/success";
	}

}
