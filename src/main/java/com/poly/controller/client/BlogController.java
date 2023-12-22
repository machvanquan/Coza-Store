package com.poly.controller.client;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.poly.dao.BlogsDAO;
import com.poly.entity.Blogs;
import com.poly.service.BlogService;

@Controller
public class BlogController {
	
	@Autowired
	BlogService blogService;
	
	@Autowired
	BlogsDAO blogsDAO;
	
	
	@GetMapping("/home/blog")
	public String blog(Model model,
	              @RequestParam("keys") Optional<String> kw,
	              @RequestParam("p") Optional<Integer> p) {
	    String title = kw.orElse("");
	    Pageable pageable = PageRequest.of(p.orElse(0), 3);
	    Page<Blogs> page = blogsDAO.findByTitle("%" + title + "%", pageable);
	    model.addAttribute("pageBlogs", page);
	    return "user/blog/blog";
	}

	
	@RequestMapping("/home/blog-detail/{id}")
	public String blog_detail(Model model, @PathVariable("id") Long id) {
		model.addAttribute("dt", blogService.findById(id));
		return "user/blog/blog-detail";
	}

}
