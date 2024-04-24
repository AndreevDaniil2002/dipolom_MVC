package ru.locate.garbage.server.service;

import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.locate.garbage.server.model.*;

import ru.locate.garbage.server.repository.ImageFromWorkerRepository;
import ru.locate.garbage.server.repository.ImageRepository;
import ru.locate.garbage.server.repository.PointRepository;
import ru.locate.garbage.server.repository.UserRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor

public class AppService {

    private final ImageRepository imageRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private PointRepository pointRepository;
    private ImageFromWorkerRepository imageFromWorkerRepository;

    public List<MyUser> getUsersByMask(String mask) {
        List<MyUser> users = userRepository.findAll();
        List<MyUser> answer = new ArrayList<>();
        for (MyUser user : users) {
            if (user.getName().contains(mask)) {
                answer.add(user);
            }
        }
        return answer;
    }



    public List<Point> getPointsByRole(String role) {
        if (Objects.equals(role, "user")){
            return pointRepository.findAllByStatusForWorkerIsNullAndStatusForAdmin("На проверке");
        }
        else{
            return pointRepository.findAllByStatusForWorkerIsNotNullAndStatusForAdmin("На проверке");
        }
    }

    public void setRole(Long userId, String role){
        userRepository.findById(userId).get().setRole(Roles.valueOf(role));
    }

    public void updateUser(MyUser user){
        userRepository.save(user);
    }

    public String getRoleByUsername(String username) {
        System.out.println(userRepository.findByName(username).get().getRole());
        return userRepository.findByName(username).get().getRole().name();
    }

    public String getRoleById(Long userId) {
        System.out.println("123412341324 " + userRepository.findById(userId).get().getRole().ordinal());
        return userRepository.findById(userId).get().getRole().name();
    }

    public String getPointStatusForUserById(Long pointId) {
        return pointRepository.findById(pointId).get().getStatusForUser();
    }

    public MyUser getUserByUserId(Long userId){
        return userRepository.findById(userId).get();
    }

    public void changeLogin(String new_login, String old_login){
        MyUser user = userRepository.findByName(old_login).get();
        user.setName(new_login);
    }

    public void changeWorker(String workerLogin, Point point){
        MyUser worker = userRepository.findByName(workerLogin).get();
        point.setWorker(worker);
        point.setStatusForAdmin(null);
    }

    public void addUser(MyUser user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Roles.valueOf("USER"));
        userRepository.save(user);
    }

    public MyUser findByLogin(String name){
        Optional<MyUser> userOptional = userRepository.findByName(name);
        return userOptional.orElse(null);
    }

    public List<MyUser> findAll(){
        return userRepository.findAll();
    }


    public List<Point> getAllPoints(){
        return pointRepository.findAllByIdNotNull();
    }

    public List<Point> getAllPointsForAdmin(){
        return pointRepository.findAllByStatusForAdmin("На проверке");
    }

    public void rejectPoint(Long pointId){
        Point point = pointRepository.findById(pointId).get();
        point.setStatusForAdmin(null);
        point.setStatusForWorker(null);
        point.setStatusForUser("Отклонена");
        pointRepository.save(point);
    }

    public List<Point> getAllPointsByUserName(String name){
        Optional<MyUser> userOptional = userRepository.findByName(name);
        Long id = userOptional.get().getId();
        //System.out.println("12345" + pointRepository.findByUserId(id));
        return pointRepository.findByUserId(id);
    }

    public List<ImageFromUser> getAllImagesByPointId(Long id){
        System.out.println("1234567");
        return imageRepository.findByPoint(pointRepository.findById(id).get());
    }

    public List<ImageFromWorker> getAllImagesFromWorkerByPointId(Long id){
        return imageFromWorkerRepository.findAllByPoint(pointRepository.findById(id).get());
    }

    public void finishWorkByWorker(Long id, MultipartFile file) throws IOException {
        ImageFromWorker imageFromWorker;
        Point point = pointRepository.findById(id).get();
        if (file.getSize() != 0){
            imageFromWorker = toImageFromWorkerEntity(file);
            point.setImageFromWorker(imageFromWorker);
            imageFromWorker.setPoint(point);
            point.setStatusForWorker("На проверке");
            point.setStatusForAdmin("На проверке");
            pointRepository.save(point);
        }

    }

    public void addPoint(Double latitude, Double longitude, String description, String username, MultipartFile file) throws IOException {
        ImageFromUser image1;
        Point point = new Point();
        point.setLatitude(latitude);
        point.setLongitude(longitude);
        point.setDescription(description);
        point.setStatusForUser("Открыта");
        point.setStatusForAdmin("На проверке");
        if (file.getSize() != 0){
            image1 = toImageFromUserEntity(file);
            point.setImageFromUser(image1);
            image1.setPoint(point);
        }
        MyUser user = userRepository.findByName(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        point.setUser(user);
        pointRepository.save(point);
    }

    private ImageFromUser toImageFromUserEntity(MultipartFile file) throws IOException {
        ImageFromUser image = new ImageFromUser();
        image.setName(file.getName());
        image.setSize(file.getSize());
        image.setOriginalFileName(file.getOriginalFilename());
        image.setContentType(file.getContentType());
        image.setBytes(file.getBytes());
        return image;
    }

    private ImageFromWorker toImageFromWorkerEntity(MultipartFile file) throws IOException {
        ImageFromWorker image = new ImageFromWorker();
        image.setName(file.getName());
        image.setSize(file.getSize());
        image.setOriginalFileName(file.getOriginalFilename());
        image.setContentType(file.getContentType());
        image.setBytes(file.getBytes());
        return image;
    }

    public void addPointFromPython(Point point){
        MyUser user = userRepository.findById(452L).orElseThrow(() -> new IllegalArgumentException("User not found"));
        point.setUser(user);
        pointRepository.save(point);
    }

    public Point getPointById(Long id){
        return pointRepository.getPointById(id);
    }

    public Long getMaxId(){
        return pointRepository.findMaxId();
    }

    public Long getMinId(){
        return pointRepository.findMinId();
    }

    public void UpdatePointClusterById(Long id, Long clusterNumber){

        Point point = pointRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Точка с указанным ID не найдена"));

        // Обновляем поле clusterNumber
        point.setCluster(clusterNumber);

        // Сохраняем обновленную точку в базу данных
        pointRepository.save(point);
    }

    public void UpdatePointPlaceById(Long id, Long place){

        Point point = pointRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Точка с указанным ID не найдена"));
        point.setPlace(place);
        System.out.println(point);
        pointRepository.save(point);
    }

    public Long getUniqueClusterNumber(){
        return pointRepository.findDistinctClusterNumber();
    }

    public List<Point> getPointsByClusterId(Long clusterNumber){
        return pointRepository.findAllByCluster(clusterNumber);
    }

}
