package ru.locate.garbage.server.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.locate.garbage.server.model.Image;
import ru.locate.garbage.server.model.MyUser;
import ru.locate.garbage.server.model.Point;
import ru.locate.garbage.server.model.Roles;
import ru.locate.garbage.server.service.AppService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@AllArgsConstructor
@EnableMethodSecurity
public class ApiController {

    @Autowired private AppService appService;

    //Перевод точки на исполнение сотрудником
    @PostMapping("/point/worker")
    public ResponseEntity<Point> addWorker(@RequestBody Point point, String workerLogin) {
        try {
            appService.changeWorker(workerLogin, point);
            return new ResponseEntity<>(point, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Получение картинки для точки (ту которую добавил пользователь)
    @GetMapping("point/{point_id}/image")
    public ResponseEntity<List<Image>> getImage(@PathVariable Long point_id) {
        try {
            //System.out.println(appService.getAllImagesByPointId(point_id));
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllImagesByPointId(point_id));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @GetMapping("/users")
    public ResponseEntity<List<MyUser>> getUsers() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.findAll());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //Смена логина пользователя
    @PostMapping("/user/login/change")
    public ResponseEntity<Void> changeLogin(@RequestBody MyUser user, Authentication auth) {
        //System.out.println("12354");
        try {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            //System.out.println("12354" + userDetails.getUsername());
            appService.changeLogin(user.getName(), userDetails.getUsername());
            return ResponseEntity.ok().build();
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //получение логина пользователя (в рамках сессии)
    @GetMapping("/user/login")
    public String gerUsername(Authentication authentication){
        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            //System.out.println(userDetails.getUsername());
            return userDetails.getUsername();
        }
        return null;
    }

    @GetMapping("/points/admin")
    public ResponseEntity<List<Point>> getAdminPoints() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllPointsForAdmin());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/points/reject/{pointId}")
    public ResponseEntity<String> RejectPoint(@PathVariable Long pointId) {
        System.out.println(pointId);
        try {
            appService.rejectPoint(pointId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Получение всех точек для вывода на карту
    @GetMapping("/points")
    public ResponseEntity<List<Point>> getPoint(@RequestParam(required = false) String username){
        //System.out.println(username);
        if (username != null) {
            List<Point> answer = appService.getAllPointsByUserName(username);
            //System.out.println(answer);
            return ResponseEntity.status(HttpStatus.OK).body(answer);
        } else {
            // Логика для получения всех точек независимо от пользователя
            //System.out.println(appService.getAllPoints());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(appService.getAllPoints());
        }
    }

    //Получение всей инфы точки по id
    @GetMapping("/points/{pointId}")
    public ResponseEntity<Point> getPointById(@PathVariable Long pointId) {
        Point point = appService.getPointById(pointId);
        if (point != null) {
            return ResponseEntity.ok(point);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //Публикация точки пользователем
    @PostMapping("/points")
    public ResponseEntity<String> addPoint(@RequestParam("file") MultipartFile file,
                                           @RequestParam("latitude") double latitude,
                                           @RequestParam("longitude") double longitude,
                                           @RequestParam("description") String description) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        //System.out.println(file.getOriginalFilename() + " " + longitude + " " + latitude + " " + description);
        try {
            appService.addPoint(latitude, longitude, description, username, file);
            return ResponseEntity.status(HttpStatus.OK).body("Point added successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while adding point");
        }
    }

    //Добавление нового юзера - регистрация
    @PostMapping("/new-user")
    public ResponseEntity<String> addUser(@RequestBody MyUser user) {
        //System.out.println(user);
        if (appService.findByLogin(user.getName()) != null) {
            // Пользователь с таким именем уже существует
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("User with this username already exists");
        }
        try {
            appService.addUser(user);
            // Пользователь создан
            return ResponseEntity.ok("User created successfully");
        } catch (Exception e) {
            // Ошибка при создании пользователя
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating user");
        }
    }

    //Получение ПД юзера
    @GetMapping("/personal-data")
    public List<String> getPersonalData (Authentication authentication){
        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            MyUser user = appService.findByLogin(username);
            List<String> answer = new ArrayList<>();
            answer.add(user.getName());
            answer.add(String.valueOf(user.getRole()));
            return answer;
        } else {
            return null;
        }
    }

    //Получения списка ролей
    @GetMapping("roles")
    public List<String> getAllRoles(){
        List<String> answer = new ArrayList<>();
        Roles[] roles = Roles.values();
        for (Roles role : roles) {
            answer.add(String.valueOf(role));
        }
        return answer;
    }

    //================ADMIN====================

    @GetMapping("/admin/points/max_id")
    public ResponseEntity<Long> getMaxId() {
        return ResponseEntity.status(HttpStatus.OK).body(appService.getMaxId());
    }

    @GetMapping("/admin/points/min_id")
    public ResponseEntity<Long> getMinId() {
        return ResponseEntity.status(HttpStatus.OK).body(appService.getMinId());
    }

    @GetMapping("/admin/cluster")
    public ResponseEntity<Long> getAllClusterNumbers(){
        try {
            //System.out.println(appService.getUniqueClusterNumber());
            return ResponseEntity.status(HttpStatus.OK).body(appService.getUniqueClusterNumber());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/admin/points/cluster/{clusterNumber}")
    public ResponseEntity<List<Point>> getPointsByClusterNumber(@PathVariable Long clusterNumber){
        //System.out.println(clusterNumber);
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getPointsByClusterId(clusterNumber));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/admin/points")
    public List<Point> getPointFromPython(@RequestParam(required = false) String username){
        if (username != null) {
            return appService.getAllPointsByUserName(username);
        } else {
            return appService.getAllPoints();
        }
    }

    @GetMapping("/admin/points/{pointId}")
    public ResponseEntity<Point> getPointByIdFromPython(@PathVariable Long pointId) {
        Point point = appService.getPointById(pointId);

        if (point != null) {
            return ResponseEntity.status(HttpStatus.OK).body(point);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/admin/points/clusters/{pointId}/{clusterNumber}")
    public ResponseEntity<String> updatePointCluster(@PathVariable Long pointId, @PathVariable Long clusterNumber){
        try {
            appService.UpdatePointClusterById(pointId, clusterNumber);
            return ResponseEntity.status(HttpStatus.OK).body("Point updated successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating point");
        }

    }

    @PatchMapping("/admin/points/place/{pointId}/{place}")
    public ResponseEntity<String> updatePointOPlace(@PathVariable Long pointId, @PathVariable Long place){
        try {
            appService.UpdatePointPlaceById(pointId, place);
            return ResponseEntity.status(HttpStatus.OK).body("Point updated successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating point");
        }

    }

    @PostMapping("/admin/points")
    public ResponseEntity<String> addPointFromPython(@RequestBody Point point){
        //System.out.println(point);
        try {
            appService.addPointFromPython(point);
            return ResponseEntity.status(HttpStatus.OK).body("Point added successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while adding point");
        }
    }
}
