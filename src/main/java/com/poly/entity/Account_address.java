
package com.poly.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Account_address")
public class Account_address {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "Không để trống tài khoản !")
	private String name;
	
	@NotBlank(message = "Không để trống số điện thoại !")
	private String phone;
	
	@NotBlank(message = "Không để trống ghi chú !")
	private String notes;
	
	@NotBlank(message = "Không để trống ấp / thôn !")
	private String address;
		
	@NotBlank(message = "Không để trống phường / xã !")
	private String ward;
	
	@NotBlank(message = "Không để trống quận / huyện !")
	private String district;
	
	@NotBlank(message = "Không để trống tỉnh / thành Phố !")
	private String province;
	
	@ManyToOne
	@JoinColumn(name = "username")
	Accounts accounts;
	
	@JsonIgnore
	@OneToMany(mappedBy = "account_address", cascade = CascadeType.ALL)
	List<Orders> orders;
	

}
