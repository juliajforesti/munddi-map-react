import React from "react";

const List = (props) => {
  const handleClick = (point) => {
    props.setPosition({ lat: point.lat, lng: point.lng });
    // props.marker.current.options.title, point.name
    props.map.flyTo([point.lat, point.lng], 18);
  };
  return (
    <div className="list-container">
      <ul>
        {props.points.map((point, idx) => (
          <li key={idx} onClick={() => handleClick(point)}>
            <h5>{point.name.toLowerCase()} </h5>
            <p>{point.street}</p>
            <p>
              {point.city} / {point.uf}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
