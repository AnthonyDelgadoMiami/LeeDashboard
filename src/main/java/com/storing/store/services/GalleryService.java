package com.storing.store.services;

import com.storing.store.models.Album;
import com.storing.store.models.GalleryImage;
import com.storing.store.repositories.AlbumRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryService {

    private final AlbumRepository albumRepository;
    private final Path rootLocation;

    public GalleryService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
        this.rootLocation = Paths.get("src/main/resources/static/uploads");
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    public Album getAlbumById(Long id) {
        return albumRepository.findById(id).orElse(null);
    }

    public void saveAlbum(Album album, MultipartFile[] files) {
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));

                    GalleryImage image = new GalleryImage();
                    image.setName(file.getOriginalFilename());
                    image.setFilePath("/uploads/" + filename);

                    album.getImages().add(image);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to store file", e);
                }
            }
        }
        albumRepository.save(album);
    }

    public void deleteAlbum(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        // Delete associated images from filesystem
        album.getImages().forEach(image -> {
            try {
                Files.deleteIfExists(rootLocation.resolve(image.getFilePath().replace("/uploads/", "")));
            } catch (IOException e) {
                // Log error but continue with deletion
                System.err.println("Failed to delete image file: " + image.getFilePath());
            }
        });

        albumRepository.delete(album);
    }

    public void addImagesToAlbum(Long albumId, MultipartFile[] files) throws IOException {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetLocation = this.rootLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation);

            GalleryImage image = new GalleryImage();
            image.setName(file.getOriginalFilename());
            image.setFilePath("/uploads/" + filename);
            image.setUploadDate(LocalDateTime.now());

            album.getImages().add(image);
        }

        albumRepository.save(album);
    }

    public void deleteImageFromAlbum(Long albumId, Long imageId) throws IOException {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        GalleryImage imageToRemove = album.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Delete from filesystem
        String filename = imageToRemove.getFilePath().replace("/uploads/", "");
        Files.deleteIfExists(rootLocation.resolve(filename));

        // Delete from database
        album.getImages().remove(imageToRemove);
        albumRepository.save(album);
    }


}