import { useContext, useId } from 'react';
import { motion } from 'framer-motion';
import { ImStarFull, ImStarHalf } from 'react-icons/im';
import { LanguageContext } from '@app/store/LanguageContext';
import defaultImage from '@app/assets/eczane-default.jpg';
import { DICTIONARY } from '@app/utils/contants';

type CardProps = {
  name: string;
  address: string;
  stars: number;
  url?: string;
  distance?: string;
  onClick: () => void;
};

export function Card({
  name,
  address,
  stars,
  url,
  distance,
  onClick,
}: CardProps) {
  const { currentLang } = useContext(LanguageContext);

  return (
    <motion.div
      className="absolute bottom-6 left-0 right-0 mx-auto my-0 w-80"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <div
        className="flex gap-2 p-2 rounded-lg shadow-xl bg-zinc-800 text-white hover:cursor-pointer"
        onClick={onClick}
      >
        <div className="w-28">
          <p>
            <img
              src={defaultImage}
              alt={`Cat for ${name}`}
              className="rounded"
            />
          </p>
        </div>
        <div className="grow">
          <h1 className="font-bold">
            {url && (
              <a
                href={url}
                className="text-sky-400"
                target="_blank"
                rel="noreferrer"
              >
                {name}
              </a>
            )}
            {!url && name}
          </h1>
          <p className="text-sm">{address}</p>
          <div className="flex items-center gap-1 text-sm text-amber-400">
            {Array.from({ length: Math.trunc(stars) }).map(() => {
              const id = useId();
              return (
                <ImStarFull key={id} />
              );
            })}
            {stars !== Math.trunc(stars) && <ImStarHalf />}
            <span className="text-white">{stars}</span>
          </div>
          {distance && (
            <p className="text-sm text-gray-400 mt-1">
              {DICTIONARY.distance[currentLang]}
              :
              {distance}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
