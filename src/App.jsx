import { useState } from "react";
import axios from "axios";

function App() {
  const [cards, setCards] = useState([]);
  const [cardsCpu, setCardsCpu] = useState([]);
  const [remaining, setRemaining] = useState(52);
  const [img, setImage] = useState("");
  const [valor, setValor] = useState(0);
  const [valorCpu, setValorCpu] = useState(0);
  const [lose, setLose] = useState(false);
  const [win, setWin] = useState(false);
  const [again, setAgain] = useState(false);
  const [placar, setPlacar] = useState(0);
  const [placarCpu, setPlacarCpu] = useState(0);
  const [disable, setDisable] = useState(false);
  const [cardOut, setCardOut] = useState([]);
  const [loading, setLoading] = useState(false)

  const iniciar = async () => {
    
      setLoading(true)
    
    setDisable(true);
    setCardOut([]);
    setCardsCpu([]);
    setValorCpu(0);
    console.log("AQUI", cards);
    setCards([{ image: "" }]);
    setImage("");
    setValor(0);
    setRemaining(50);
    setLose(false);
    setWin(false);
    setAgain(false);
    const optionsa = {
      method: "GET",
      url: "https://simpleapi-backend.herokuapp.com/cards-shuffle",
    };

    const embaralhar = await axios.request(optionsa);

    const options = {
      method: "GET",
      url: "https://simpleapi-backend.herokuapp.com/cards-draw/2",
    };

    const carta = await axios.request(options);
    
    let returnImg = img;
    returnImg =
      returnImg +
      `<img className="ml-4" src="${carta.data.cards[0].image.toString()}" alt="" />`;
    setImage(returnImg);
    const array = [];
    array.push(carta.data.cards[0]);
    array.push(carta.data.cards[1]);
    setCards(array);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    setLoading(false)
    await delay(500);
    let num = 0;
    if (
      carta.data.cards[0].value == "KING" ||
      carta.data.cards[0].value == "JACK" ||
      carta.data.cards[0].value == "QUEEN"
    ) {
      num += 10;
    } else if (carta.data.cards[0].value == "ACE" && num < 12) {
      num += 10;
    } else if (carta.data.cards[0].value == "ACE" && num > 11) {
      num += 1;
    } else {
      num += parseInt(carta.data.cards[0].value);
    }
    if (
      carta.data.cards[1].value == "KING" ||
      carta.data.cards[1].value == "JACK" ||
      carta.data.cards[1].value == "QUEEN"
    ) {
      num += 10;
    } else if (carta.data.cards[1].value == "ACE" && num < 12) {
      num += 10;
    } else if (carta.data.cards[1].value == "ACE" && num > 11) {
      num += 1;
    } else {
      num += parseInt(carta.data.cards[1].value);
    }
    setValor(num);
  };

  const zerar = () => {
    setDisable(false);
    setCardOut([]);
    setCardsCpu([]);
    setValorCpu(0);
    console.log("AQUI", cards);
    setCards([]);
    setImage("");
    setValor(0);
    setRemaining(52);
    setLose(false);
    setWin(false);
    setAgain(false);
    setPlacar(0);
    setPlacarCpu(0);
  };

  const cpu = async (numero) => {
    let num = 0;

    const array = [];

    const options = {
      method: "GET",
      url: "https://simpleapi-backend.herokuapp.com/cards-draw/1",
    };

    let random = 16 + Math.floor(Math.random() * 4);
    if (numero < 18) {
      random = numero;
    }
    console.log("[random]", random);

    while (num < random) {
      const carta = await axios.request(options);
      console.log(carta.data.cards[0].value);
      array.push(carta.data.cards[0]);
      setRemaining(carta.data.remaining);
      if (
        carta.data.cards[0].value == "KING" ||
        carta.data.cards[0].value == "JACK" ||
        carta.data.cards[0].value == "QUEEN" ||
        carta.data.cards[0].value == "ACE"
      ) {
        num += 10;
      } else {
        num += parseInt(carta.data.cards[0].value);
      }

      if (num > 21) {
        let ace = false;
        array.forEach((e) => {
          if (e.value == "ACE") {
            ace = true;
            e.value = "ACEU";
            num -= 9;
          }
        });
      }
    }

    setCardsCpu(array);
    setValorCpu(num);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1500);
    if (numero > 21 && num > 21) {
      console.log("primeiro", numero, num);
      setAgain(true);
      setDisable(false);
      return;
    } else if (numero > 21 && num < 22) {
      console.log("segundo", numero, num);
      setLose(true);
      setPlacarCpu(placarCpu + 1);
      setDisable(false);
      return;
    }

    if (numero > num || num > 21) {
      console.log("terceiro", numero, num);
      setWin(true);
      setPlacar(placar + 1);
      setDisable(false);
    } else if (numero == num) {
      console.log("quarto", numero, num);
      setAgain(true);
      setDisable(false);
    } else {
      console.log("quinto", numero, num);
      setLose(true);
      setPlacarCpu(placarCpu + 1);
      setDisable(false);
    }
    console.log(num);
  };

  const descarte = async () => {
    const options = {
      method: "GET",
      url: "https://simpleapi-backend.herokuapp.com/cards-draw/1",
    };

    const carta = await axios.request(options);

    const array = cardOut;
    array.push(carta.data.cards[0]);
    setCardOut(array);
    setRemaining(carta.data.remaining);
  };

  const getCartas = async () => {
    console.log("AQUI");
    const options = {
      method: "GET",
      url: "https://simpleapi-backend.herokuapp.com/cards-draw/1",
    };

    const carta = await axios.request(options);
    let returnImg = img;
    returnImg =
      returnImg +
      `<img className="ml-4" src="${carta.data.cards[0].image.toString()}" alt="" />`;
    setImage(returnImg);
    const array = cards;
    array.push(carta.data.cards[0]);
    setCards(array);
    setRemaining(carta.data.remaining);
    console.log(cards);
    let num = valor;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    if (
      carta.data.cards[0].value == "KING" ||
      carta.data.cards[0].value == "JACK" ||
      carta.data.cards[0].value == "QUEEN" ||
      carta.data.cards[0].value == "ACE"
    ) {
      num += 10;
      setValor(num);
    } else {
      num += parseInt(carta.data.cards[0].value);
      setValor(num);
    }

    if (num > 21) {
      let ace = false;
      try {
        
        cards.forEach((e) => {
          if (e.value == "ACE") {
            ace = true;
            e.value = "ACEU";
            throw new Exception("Time to end the loop");
          }
        });
      } catch (error) {
        console.log("AQUI");
      }
      await delay(1000);
      if (!ace) {
        cpu(num);
      } else {
        setValor(num - 9);
        num -= 9;
      }
    }

    await delay(1000);
    if (num == 21) {
      setWin(true);
      setPlacar(placar + 1);
      setDisable(false);
    }
  };

  return (
    <div className="bg-green-600 fixed w-full h-full pt-6">
      <div className="w-[94%] flex-col bg-white max-w-[400px] h-[600px] shadow-md shadow-green-800 rounded-md p-2 mx-auto ">
        <div>
          <p className="text-center font-bold text-black-600 mt-2 text-[38px]">
            BLACKJACK
          </p>
          <div className="text-left ml-4">
            <label className=" text-center font-semibold text-slate-600">
              PLAYER:{" "}
              <label className="text-blue-900 text-[20px]">{placar}</label>
            </label>
            <label className="ml-2 text-center font-semibold text-slate-600">
              CPU:{" "}
              <label className="text-blue-900 text-[20px]">{placarCpu}</label>
            </label>
            <button
              className=" ml-4 bg-red-500 text-sm  text-white p-1 absolute font-bold rounded-md"
              onClick={zerar}
            >
              ZERAR PLACAR
            </button>
          </div>
          <div className="flex mt-2 justify-between">
            <button
              disabled={disable}
              className={
                disable
                  ? "mt-4 mb-2 ml-4 bg-blue-200 text-sm pt-3 text-white p-2 font-bold rounded-md"
                  : "mt-4 mb-2 ml-4 bg-blue-500 text-sm pt-3 text-white p-2 font-bold rounded-md"
              }
              onClick={iniciar}
            >
              {placar || placarCpu ? "CONTINUAR" : "INICIAR"}
            </button>

            <div className=" mr-2">
              <p className="ml-6 text-left text-sm font-semibold text-slate-600">
                CARTAS BARALHO:{" "}
                <label className="text-green-800">{remaining}</label>{" "}
              </p>
              <button
                disabled={!disable || remaining < 32}
                className={
                  !disable || remaining < 32
                    ? " ml-4 bg-gray-200 text-sm text-white p-2 font-bold rounded-md"
                    : " ml-4 bg-yellow-500 text-sm text-white p-2 font-bold rounded-md"
                }
                onClick={descarte}
              >
                DESCARTAR PROXIMA
              </button>
            </div>
          </div>


          <div className="flex mt-1 ml-20">
            {cards.map((e) => {
              return (
                <div className="-ml-16">
                  <img width={"80px"} src={e.image} />
                </div>
              );
            })}
          </div>
          {loading   &&(


<div className=" p-8">

<img className="mx-auto" width={"50px"} src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif" alt="" />
</div>
         
          )}
          {valor > 0 && (
            <div className="flex">
              <p className="ml-6 mt-2 text-left font-semibold text-slate-600 ">
                PLAYER:{" "}
                <label className="text-green-800 text-[26px]">{valor}</label>
              </p>
              <button
                disable={valor > 21}
                className={
                  valor > 21
                    ? "ml-4 mt-2 p-2 bg-indigo-200 text-white  font-bold rounded-md"
                    : "ml-4 mt-2 p-2 bg-indigo-500 text-white  font-bold rounded-md"
                }
                onClick={getCartas}
              >
                NOVA CARTA
              </button>
              <button
                disable={valor > 21}
                className={
                  valor > 21
                    ? "ml-4 mt-2 p-2 bg-green-200 text-white  font-bold rounded-md"
                    : "ml-4 mt-2 p-2 bg-green-500 text-white  font-bold rounded-md"
                }
                onClick={() => {
                  cpu(valor);
                }}
              >
                OK
              </button>
            </div>
          )}

          <div className="flex mt-2 ml-20">
            {cardsCpu.map((e) => {
              return (
                <>
                  <div className="-ml-16">
                    <img width={"80px"} src={e.image} />
                  </div>
                </>
              );
            })}
          </div>

          {cardsCpu.length > 0 && (
            <p className="ml-6 mt-2 text-left font-semibold text-slate-600 mb-8">
              CPU:{" "}
              <label className="text-green-800 text-[26px]">{valorCpu}</label>
            </p>
          )}
          {lose && (
            <div className="fixed opacity-75">
              <img
                style={{
                  maxWidth: "400px",
                  marginLeft: "-6px",
                  marginRight: "",
                }}
                width={"98%"}
                className={cardsCpu.length ? "-mt-[360px]" : "-mt-[170px] "}
                src="https://c.tenor.com/kRYmL5XfwzMAAAAC/miggi-you-lose.gif"
              ></img>
            </div>
          )}
          {win && (
            <div className="fixed opacity-75">
              <img
                style={{
                  maxWidth: "400px",
                  marginLeft: "-6px",
                  marginRight: "",
                }}
                width={"98%"}
                className={cardsCpu.length ? "-mt-[360px]" : "-mt-[170px] "}
                src="https://c.tenor.com/h3w4fXXdDLkAAAAd/miggi-you-win.gif"
              ></img>
            </div>
          )}
          {again && (
            <div className="fixed opacity-75">
              <img
                style={{
                  maxWidth: "450px",
                  marginLeft: "30px",
                  marginRight: "",
                }}
                width={"98%"}
                className={cardsCpu.length ? "-mt-[320px]" : "-mt-[130px] "}
                src="https://www.brilliantmaths.com/wp-content/uploads/2020/04/retry.gif"
              ></img>
            </div>
          )}
        </div>

        <div className=" fixed bottom-5 right-2 flex mt-4 ">
          {cardOut.map((e) => {
            return (
              <>
                <div className="-ml-16 grayscale">
                  <img width={"50px"} src={e.image} />
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
