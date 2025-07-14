import { useState } from "react";
import "./App.css";

function Profile({ person }) {
  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={getImageUrl(person.Avatar)}
        alt={person.name}
        width={70}
        height={70}
      />
      <ul>
        <li>
          <b>Profession: </b>
          {person.Profession}
        </li>
        <li>
          <b>Awards: </b>
          {person.Awards}
        </li>
        <li>
          <b>Discovered: </b>
          {person.Discovered}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  const persons = [
    {
      id: 1,
      name: "Maria Skłodowska-Curie",
      Avatar: "szV5sdG",
      Profession: "physicist and chemist",
      Awards:
        "4(Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)",
      Discovered: "polonium (chemical element)",
    },
    {
      id: 2,
      name: "Katsuko Saruhashi",
      Avatar: "YfeOqp2",
      Profession: "geochemist",
      Awards: "2(Miyake Prize for geochemistry, Tanaka Prize)",
      Discovered: "a method for measuring carbon dioxide in seawater",
    },
  ];

  return (
    <div>
      <h1>Notable Scientists</h1>
      {persons.map((person) => (
        <Profile person={person} key={person.id} />
      ))}
    </div>
  );
}

function Profile() {
  const person = {
    name: "Aklilu Lemma",
    Avatar: "OKS67lhm",
    Profession: "scientist",
    Awards: "1(Nobel Prize in Physics)",
    Discovered: "schistosomiasis",
  };
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>
            Aklilu Lemma was a distinguished Ethiopian scientist who discovered
            a natural treatment to schistosomiasis.
          </p>
        </div>
      </div>
    </div>
  );
}
function Card() {
  return (
    <div className="card">
      <div className="card-content">
        <h1>About</h1>
        <p>
          Aklilu Lemma was a distinguished Ethiopian scientist who discovered a
          natural treatment to schistosomiasis.
        </p>
      </div>
    </div>
  );
}
