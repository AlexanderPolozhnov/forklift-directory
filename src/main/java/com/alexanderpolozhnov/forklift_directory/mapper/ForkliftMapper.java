package com.alexanderpolozhnov.forklift_directory.mapper;

import com.alexanderpolozhnov.forklift_directory.dto.request.ForkliftRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.ForkliftResponse;
import com.alexanderpolozhnov.forklift_directory.entity.Forklift;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ForkliftMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "incidents", ignore = true)
    Forklift toEntity(ForkliftRequest request);

    ForkliftResponse toResponse(Forklift forklift);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "incidents", ignore = true)
    void updateEntity(@MappingTarget Forklift forklift, ForkliftRequest request);
}
