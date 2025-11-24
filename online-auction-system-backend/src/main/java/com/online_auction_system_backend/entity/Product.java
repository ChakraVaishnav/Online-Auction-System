package com.online_auction_system_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getStartingPrice() {
		return startingPrice;
	}

	public void setStartingPrice(Double startingPrice) {
		this.startingPrice = startingPrice;
	}

	public Double getCurrentBid() {
		return currentBid;
	}

	public void setCurrentBid(Double currentBid) {
		this.currentBid = currentBid;
	}

	public Long getHighestBidderId() {
		return highestBidderId;
	}

	public void setHighestBidderId(Long highestBidderId) {
		this.highestBidderId = highestBidderId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getImageBase64() {
	    return imageBase64;
	}

	public void setImageBase64(String imageBase64) {
	    this.imageBase64 = imageBase64;
	}


	private Long ownerId;

    private String title;
    private String description;

    private Double startingPrice;
    private Double currentBid;

    private Long highestBidderId;  // updates when someone bids

    private String status; // "LIVE" or "ENDED"
    @Column(columnDefinition = "LONGTEXT")
    private String imageBase64;

}
