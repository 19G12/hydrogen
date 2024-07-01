import {useState} from 'react';

export function ProductsOptions({options}) {
  const [params, setParams] = useState([
    {name: 'FLAVOURS', value: options && options[0]?.values[0]},
    {name: 'Pack', value: options && options[1]?.values[0]},
  ]);
  function HandleClicks(e) {
    // console.log(e.target.getAttribute('name'),e.target.getAttribute('value'),"_clicks_");
    const newArray = params.map((item) => {
      if (item.name === e.target.getAttribute('name')) {
        return {
          name: e.target.getAttribute('name'),
          value: e.target.getAttribute('value'),
        };
      }
      return item;
    });
    setParams(newArray);
  }

  return (
    options &&
    options.map((vals, ind) => {
      return (
        <>
          <div
            key={vals?.name}
            value={vals?.name}
            className="font-sans font-bold"
          >
            {' '}
            {vals?.name}{' '}
          </div>
          <div className="flex flex-row justify-flex-start gap-x-2">
            {vals?.values.map((inVals, inInd) => {
              return (
                <div
                  name={vals?.name}
                  value={inVals}
                  key={vals?.name + inVals}
                  className="bg-green-500 p-2 border-2 border-black	border-solid rounded-3xl"
                  onClick={HandleClicks}
                >
                  {inVals}
                </div>
              );
            })}
          </div>
        </>
      );
    })
  );
}
