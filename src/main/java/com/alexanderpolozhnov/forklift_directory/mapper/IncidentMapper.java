package com.alexanderpolozhnov.forklift_directory.mapper;

import com.alexanderpolozhnov.forklift_directory.dto.request.IncidentRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.IncidentResponse;
import com.alexanderpolozhnov.forklift_directory.entity.Incident;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface IncidentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "forklift", ignore = true)
    Incident toEntity(IncidentRequest request);

    @Mapping(target = "forkliftId", source = "forklift.id")
    @Mapping(target = "downtimeFormatted", expression = "java(formatDowntime(incident.getDowntimeMinutes()))")
    IncidentResponse toResponse(Incident incident);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "forklift", ignore = true)
    void updateEntity(@MappingTarget Incident incident, IncidentRequest request);

    default String formatDowntime(long minutes) {
        long hours = minutes / 60;
        long mins = minutes % 60;
        if (hours > 0) {
            return hours + "ч " + String.format("%02d", mins) + "мин";
        }
        return mins + "мин";
    }
}
