package com.wipro.auth_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "credit_profile_table")
public class CreditProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private int creditScore;
	private double monthlyIncome;
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;

	public CreditProfile(){

	}

	public CreditProfile(Long id, int creditScore, double monthlyIncome, User user) {
		super();
		this.id = id;
		this.creditScore = creditScore;
		this.monthlyIncome = monthlyIncome;
		this.user = user;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getCreditScore() {
		return creditScore;
	}

	public void setCreditScore(int creditScore) {
		this.creditScore = creditScore;
	}

	public double getMonthlyIncome() {
		return monthlyIncome;
	}

	public void setMonthlyIncome(double monthlyIncome) {
		this.monthlyIncome = monthlyIncome;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "CreditProfile [id=" + id + ", creditScore=" + creditScore + ", monthlyIncome=" + monthlyIncome
				+ ", user=" + user + "]";
	}

}
