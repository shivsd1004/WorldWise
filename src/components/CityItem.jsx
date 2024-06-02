import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useLocalCities } from "../contexts/LocalCitiesContext";
import Flag from "./Flag";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
function CityItem({ city }) {
  const { currentCity, deleteCity } = useLocalCities();
  const { cityName, countryCode, date, id, position } = city;

  function handleclick(e) {
    e.preventDefault();
    deleteCity(id);
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${Number(position?.lat)}&lng=${Number(position?.lng)}`}
      >
        <span className={styles.flag}>
          <Flag countryCode={countryCode} />
        </span>

        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleclick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
