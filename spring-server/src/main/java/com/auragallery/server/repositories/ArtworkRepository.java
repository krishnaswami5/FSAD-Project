package com.auragallery.server.repositories;

import com.auragallery.server.models.Artwork;
import com.auragallery.server.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByCategory(Category category);
    List<Artwork> findByTitleContainingIgnoreCase(String title);
    List<Artwork> findByArtistId(Long artistId);
}
