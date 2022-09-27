import "./App.css";
import { useState, useCallback, useMemo } from "react";

const mockData = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Alix Cui",
  "Jean Paul",
  "Xdxd",
  "Peng Lu",
  "Ethan Ko",
  "Blah blah"
];

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="chevron"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const ChevronUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="chevron"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

const Checkbox = ({ checked }) => {
  return (
    <div className={`checkbox ${checked && "checkbox__checked"}`}>
      {checked && <span>&#x2713;</span>}
    </div>
  );
};

const MultiselectDropdownSingle = ({ data, onChange, value }) => {
  const [inFocus, setInFocus] = useState(false);

  return (
    <div className="multiselect" tabindex="0" onBlur={() => setInFocus(false)}>
      <div onClick={() => setInFocus(!inFocus)} className="dropdown__selection">
        {value ? <div>{value}</div> : <div>&#8203;</div>}
        {inFocus ? <ChevronUp /> : <ChevronDown />}
      </div>

      {inFocus && (
        <ul className="dropdown__list">
          {data.map((datum) => (
            <li
              className="dropdown__listitem"
              key={datum}
              onClick={() => onChange(datum)} // React does not re-render because of the key and the native HTML <li/> item
            >
              <span>{datum}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MultiselectDropdownChecked = ({ onChange, value, data }) => {
  const [inFocus, setInFocus] = useState(false);

  const memoizedValue = useMemo(() => {
    return new Set(value);
  }, [value]);

  const selectItem = (checked, datum) => {
    if (checked) {
      onChange([...value, datum]);
    } else {
      onChange(value.filter((item) => item !== datum));
    }
  };

  return (
    <div className="multiselect" tabindex="0" onBlur={() => setInFocus(false)}>
      <div onClick={() => setInFocus(!inFocus)} className="dropdown__selection">
        {value.length === 0 ? (
          <div>&#8203;</div>
        ) : (
          <div>
            {value.map((selectedItem, i) => {
              if (i === value.length - 1) {
                return <span key={selectedItem}>{selectedItem}</span>;
              }
              return <span key={selectedItem}>{`${selectedItem}, `}</span>;
            })}
          </div>
        )}
        {inFocus ? <ChevronUp /> : <ChevronDown />}
      </div>

      {inFocus && (
        <ul className="dropdown__list">
          {value.length === data.length ? (
            <li onClick={() => onChange([])}>Deselect all options</li>
          ) : (
            <li onClick={() => onChange([...data])}>Select all options</li>
          )}
          {data.map((datum) => (
            <li
              className="dropdown__listitem"
              key={datum}
              onClick={() => selectItem(!memoizedValue.has(datum), datum)}
            >
              <Checkbox checked={memoizedValue.has(datum)} />
              <span>{datum}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MultiselectDropdown = ({ multiselect, ...rest }) => {
  return (
    <>
      {multiselect ? (
        <MultiselectDropdownChecked {...rest} />
      ) : (
        <MultiselectDropdownSingle {...rest} />
      )}
    </>
  );
};

function App() {
  // Multiselect Checked - this assumes all items are unique (UX decision for a multiselect dropdown)
  const [persons, setPersons] = useState([]);

  // Single Select
  const [person, setPerson] = useState("");

  const handleCheckedChange = useCallback(
    (persons) => {
      setPersons(persons);
    },
    [setPersons]
  );

  const handleSingleChange = useCallback(
    (person) => {
      setPerson(person);
    },
    [setPerson]
  );

  return (
    <div className="App">
      <div>
        <h3>Multiple Select</h3>
        <MultiselectDropdown
          multiselect
          data={mockData}
          onChange={handleCheckedChange}
          value={persons}
        />
      </div>
      <div>
        <h3>Single Select</h3>
        <MultiselectDropdown
          data={mockData}
          onChange={handleSingleChange}
          value={person}
        />
      </div>
    </div>
  );
}

export default App;
