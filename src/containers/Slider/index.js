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
        <>
          <div
            key={event.id}
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
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;

// CORRECTIONS :
// 1. LINE 12 / Descending order events (latest event first) : Invert EvtA and EvtB in the sort function + add a condition to check if the date is lower than the other date (1: -1)
// 2. LINE 47 / Radio Buttons : The radio buttons were not working properly because the key was the same for all the radio buttons. I replaced idx by index to make sure the key is unique for each radio button.
// 3. LINE 44 and 46 / Children with the same key : I changed key={'${event.id}'} to key={'${_.title}'}. The underscore is a convention to indicate that the variable is not used in the map function.
// 4. LINE 15 / ByDateDesc not defined : I added if (!byDateDesc) return; to prevent the function from running if byDateDesc is undefined.
// 5. LINE  / Blank Card Problem : changed the setTimeout function to setIndex((index + 1) % byDateDesc.length) to prevent the blank card from appearing. Modulo operator will make sure the index is always within the range of the array.
// 6. LINE  / No month in first card :