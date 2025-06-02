package com.storing.store.controllers;

import com.storing.store.models.Album;
import com.storing.store.services.GalleryService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/galleria")
public class GalleryController {

    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    // Gallery main page - lists all albums
    @GetMapping
    public String showGallery(Model model) {
        model.addAttribute("albums", galleryService.getAllAlbums());
        return "galleria";
    }

    // View single album - changed to consistent path
    @GetMapping("/album/{albumId}")
    public String viewAlbum(@PathVariable("albumId") Long id, Model model) {
        Album album = galleryService.getAlbumById(id);
        model.addAttribute("album", album);
        return "galleria/album";
    }

    // Add images to existing album
    @PostMapping("/album/{albumId}/add-images")
    public String addImagesToAlbum(
            @PathVariable("albumId") Long id,
            @RequestParam("newImages") MultipartFile[] files,
            RedirectAttributes redirectAttributes) {

        try {
            if (files == null || files.length == 0 || files[0].isEmpty()) {
                throw new IllegalArgumentException("Please select at least one image");
            }

            galleryService.addImagesToAlbum(id, files);
            redirectAttributes.addFlashAttribute("success", "Images added successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/galleria/album/" + id; // Fixed redirect path
    }

    // Delete image from album
    @PostMapping("/album/{albumId}/delete-image/{imageId}")
    public String deleteImageFromAlbum(
            @PathVariable("albumId") Long albumId,
            @PathVariable("imageId") Long imageId,
            RedirectAttributes redirectAttributes) {

        try {
            galleryService.deleteImageFromAlbum(albumId, imageId);
            redirectAttributes.addFlashAttribute("success", "Image deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/galleria/album/" + albumId; // Fixed redirect path
    }

    // Show upload form for new album
    @GetMapping("/upload")
    public String showUploadForm(Model model) {
        model.addAttribute("album", new Album());
        return "galleria/upload";
    }

    // Handle new album creation
    @PostMapping("/upload")
    public String handleUpload(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("images") MultipartFile[] files,
            RedirectAttributes redirectAttributes) {

        if (files == null || files.length == 0 || files[0].isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select at least one image");
            return "redirect:/galleria/upload";
        }

        Album album = new Album();
        album.setTitle(title);
        album.setDescription(description);

        galleryService.saveAlbum(album, files);
        return "redirect:/galleria";
    }

    // Delete entire album
    @PostMapping("/delete/{id}")
    public String deleteAlbum(@PathVariable Long id) {
        galleryService.deleteAlbum(id);
        return "redirect:/galleria";
    }
}