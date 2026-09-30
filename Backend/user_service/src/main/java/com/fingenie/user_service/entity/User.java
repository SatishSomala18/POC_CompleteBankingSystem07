package com.fingenie.user_service.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users_table")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String email;
	private String password;
	private String roles;
	private String phone;
	private String kycStatus;
	private String kycDocumentType;
	private String kycDocumentNumber;
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private UserSecurity usersecurity;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private CreditProfile creditprofile;

	public User() {

	}

	public User(Long id, String name, String email, String password, String roles, String phone,
			UserSecurity usersecurity, CreditProfile creditprofile) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.roles = roles;
		this.phone = phone;
		this.usersecurity = usersecurity;
		this.creditprofile = creditprofile;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public UserSecurity getUsersecurity() {
		return usersecurity;
	}

	public void setUsersecurity(UserSecurity usersecurity) {
		this.usersecurity = usersecurity;
	}

	public CreditProfile getCreditprofile() {
		return creditprofile;
	}

	public void setCreditprofile(CreditProfile creditprofile) {
		this.creditprofile = creditprofile;
	}

	public String getKycStatus() {
		return kycStatus;
	}

	public void setKycStatus(String kycStatus) {
		this.kycStatus = kycStatus;
	}

	public String getKycDocumentType() {
		return kycDocumentType;
	}

	public void setKycDocumentType(String kycDocumentType) {
		this.kycDocumentType = kycDocumentType;
	}

	public String getKycDocumentNumber() {
		return kycDocumentNumber;
	}

	public void setKycDocumentNumber(String kycDocumentNumber) {
		this.kycDocumentNumber = kycDocumentNumber;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", roles=" + roles
				+ ", phone=" + phone + ", kycStatus=" + kycStatus + "]";
	}

}
