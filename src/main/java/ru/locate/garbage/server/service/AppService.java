package ru.locate.garbage.server.service;

import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.locate.garbage.server.model.Image;
import ru.locate.garbage.server.model.MyUser;
import ru.locate.garbage.server.model.Point;
import ru.locate.garbage.server.model.Roles;
import ru.locate.garbage.server.repository.ImageRepository;
import ru.locate.garbage.server.repository.PointRepository;
import ru.locate.garbage.server.repository.UserRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor

public class AppService {

    private final ImageRepository imageRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private PointRepository pointRepository;

    public Integer getRoleByUsername(String username) {
        System.out.println(userRepository.findByName(username).get().getRole().ordinal());
        return userRepository.findByName(username).get().getRole().ordinal();
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

    public List<Image> getAllImagesByPointId(Long id){
        System.out.println("1234567");
        return imageRepository.findByPoint(pointRepository.findById(id).get());
    }

    public void addPoint(Double latitude, Double longitude, String description, String username, MultipartFile file) throws IOException {
        Image image1;
        Point point = new Point();
        point.setLatitude(latitude);
        point.setLongitude(longitude);
        point.setDescription(description);
        point.setStatusForUser("Открыта");
        point.setStatusForAdmin("На проверке");
        if (file.getSize() != 0){
            image1 = toImageEntity(file);
            point.setImage(image1);
            image1.setPoint(point);
        }
        //Проверка на добавление точки, которая уже существует (нужно для тестирования)
        //List<Point> checkIfPointExist = pointRepository.findByLatitudeAndLongitude(point.getLatitude(), point.getLongitude());
        //System.out.println(checkIfPointExist);
        MyUser user = userRepository.findByName(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        point.setUser(user);
        pointRepository.save(point);
    }

    private Image toImageEntity(MultipartFile file) throws IOException {
        Image image = new Image();
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
