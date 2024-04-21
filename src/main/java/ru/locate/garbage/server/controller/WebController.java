package ru.locate.garbage.server.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.locate.garbage.server.service.AppService;

@Controller
public class WebController {

    @Autowired public AppService appService;

    @GetMapping("/api/v1/welcome")
    public String welcomePage(Model model){
        return "index_my";
    }

    @GetMapping("/account")
    public String accountPage(Model model, Authentication auth){
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        Integer role = appService.getRoleByUsername(userDetails.getUsername());
        if (role == 0)
            return "lk/user";
        else if (role == 1)
            return "lk/admin";
        else
            return "lk/worker";
    }

    @GetMapping("/personal-data")
    public String PdPage(Model model){
        return "personalData";
    }

    @GetMapping(value = "/map")
    public String getMapPage(Model model){
        return "map";
    }

    @GetMapping("/registration")
    public String regPage(Model model) {
        return "registration";
    }

    @GetMapping("/new-point")
    public String addPoint(Model model) {
        return "add_point";
    }

    @GetMapping("/my-points")
    public String getUserPoints(Model model){
        return "user_points";
    }

    @GetMapping("/point-card")
    public String getPointCard(Model model, HttpServletRequest request) {
        String point_id = request.getParameter("id");
        model.addAttribute("pointId", point_id);
        return "point-card";
    }

    @GetMapping("/reject-point-card")
    public String rejectPointCard(Model model, HttpServletRequest request) {
        String point_id = request.getParameter("id");
        model.addAttribute("pointId", point_id);
        return "reject-point-card";
    }

    @GetMapping("/upload")
    public String upload(Model model) {
        return "image_uppload";
    }

    @GetMapping("/login/index")
    public String login(Model model) {
        return "index";
    }

}
