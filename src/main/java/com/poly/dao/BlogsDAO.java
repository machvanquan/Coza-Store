package com.poly.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.poly.entity.Blogs;

public interface BlogsDAO extends JpaRepository<Blogs, Long> {
	
	@Query(value = "select TOP 3 * from Blogs order by create_date desc;", nativeQuery = true)
	List<Blogs> load3Blogs();
	
	@Query(value = "SELECT * FROM Blogs WHERE title like ?1 order by create_date desc;", nativeQuery = true)
	Page<Blogs> findByTitle(String title, Pageable pageable);
	

}
