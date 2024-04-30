import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";


const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtB.date) < new Date(evtA.date) ? 1 : -1 // Problem 1
  );

  const generateUniqueId = () => `id-${Math.random().toString(36).substr(2, 9)}`;

  const nextCard = () => {
    if (!byDateDesc) return; // Problem 4
    setTimeout(
      () => setIndex((index + 1) % byDateDesc.length),
      5000
    ); // Problem 5
  };
  useEffect(() => {
    nextCard();
  });
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={generateUniqueId()}>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={`${_.title}`} // Problem 3
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx} // Problem 2
                  onChange={() => setIndex(radioIdx)} // Problem 7
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;

// CORRECTIONS :
// 1. LINE 12 / Descending order events (latest event first) : Invert EvtA and EvtB in the sort function + add a condition to check if the date is lower than the other date (1: -1)
// 2. LINE 53 / Radio Buttons : The radio buttons were not working properly because Idx was used instead of Index. I replaced idx by index.
// 3. LINE 50 / Children with the same key : I changed key={'${event.id}'} to key={'${_.title}'}. The underscore is a convention to indicate that the variable is not used in the map function.
// 4. LINE 18 / ByDateDesc not defined : I added if (!byDateDesc) return; to prevent the function from running if byDateDesc is undefined.
// 5. LINE 17 / Blank Card Problem : changed the setTimeout function to setIndex((index + 1) % byDateDesc.length) to prevent the blank card from appearing. Modulo operator will make sure the index is always within the range of the array.
// 6. HELPER/DATE / No month in first card and month not right : Month displayed aren't right. (it's displayed minus 1 eg: month in mars go to february). I added +1 to the getMonth function to fix the issue (zero-based indexing).
// 7. LINE 54 / Warning in console : "You provided a `checked` prop to a form field without an `onChange` handler". // I added OnChange function to the radio buttons to fix the issue.
// 8. LINE 15 / Console Warning : Warning: Each child in a list should have a unique "key" prop. // I