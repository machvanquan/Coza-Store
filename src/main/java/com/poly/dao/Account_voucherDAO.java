package com.poly.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.poly.entity.Account_voucher;
import com.poly.entity.Accounts;
import com.poly.entity.Vouchers;

public interface Account_voucherDAO extends JpaRepository<Account_voucher, Long>{
	
	@Query(value = "select * from Account_voucher where Account_voucher.username = ?1", nativeQuery = true)
	List<Account_voucher> findByUsername(String username);
	
	boolean existsByAccountsAndVouchers(Accounts accounts, Vouchers voucher);

}
