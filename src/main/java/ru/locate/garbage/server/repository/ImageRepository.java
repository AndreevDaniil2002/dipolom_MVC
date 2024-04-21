package ru.locate.garbage.server.repository;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.locate.garbage.server.model.Image;
import ru.locate.garbage.server.model.Point;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    @NonNull
    Optional<Image> findById(@NonNull Long id);

    List<Image> findByPoint(Point point);
}
