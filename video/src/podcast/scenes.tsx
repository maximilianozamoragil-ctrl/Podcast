// Topic visuals shown on the studio screen. Times are absolute seconds
// taken from the transcript, so each visual appears as it is mentioned.
import React from "react";
import { Arrow, Chip, Col, Counter, Cross, Emoji, Label, Pop, Pulse, Row, Title } from "./kit";
import { CAST } from "./cast";

export type Scene = { from: number; to: number; name: string; el: React.ReactNode };

const G = "#7CFFB2";
const R = "#ff6b7a";
const Y = "#ffd166";

const Verdict: React.FC<{ at: number; who: keyof typeof CAST; icon: string; title: string; note: string }> = ({
  at,
  who,
  icon,
  title,
  note,
}) => {
  const c = CAST[who];
  return (
    <Pop at={at} from="up">
      <div
        style={{
          width: 350,
          height: 330,
          borderRadius: 30,
          background: "rgba(255,255,255,0.08)",
          border: `5px solid ${c.color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 18,
          boxSizing: "border-box",
        }}
      >
        <Chip color={c.color}>{c.name}</Chip>
        <Emoji e={icon} size={60} />
        <Label size={28} color="#fff">{title}</Label>
        <Label size={22} color="#ffffffaa">{note}</Label>
      </div>
    </Pop>
  );
};

export const SCENES: Scene[] = [
  {
    from: 0,
    to: 8.5,
    name: "Intro",
    el: (
      <Col gap={20}>
        <Pop at={0.3}>
          <Emoji e="🎙️" size={150} />
        </Pop>
        <Pop at={0.8} from="up">
          <Title size={92}>VIDEO PODCAST</Title>
        </Pop>
        <Pop at={2.2} from="up">
          <Row gap={16}>
            <Chip color={CAST.max.color}>Max</Chip>
            <Chip color={CAST.valen.color}>Valen</Chip>
            <Chip color={CAST.rashid.color}>Rashid</Chip>
          </Row>
        </Pop>
      </Col>
    ),
  },
  {
    from: 8.5,
    to: 14.6,
    name: "Tema",
    el: (
      <Col gap={22}>
        <Pop at={8.8} from="up">
          <Label size={40} color={Y}>EL TEMA DE HOY</Label>
        </Pop>
        <Row gap={30}>
          <Pop at={9.4}>
            <Emoji e="🧫" size={140} />
          </Pop>
          <Pop at={9.8}>
            <Emoji e="🥩" size={140} />
          </Pop>
        </Row>
        <Pop at={10.6} from="up">
          <Title size={84}>Carne cultivada</Title>
        </Pop>
        <Pop at={12.5}>
          <Label color={R}>¡Bastante polémico! 🔥</Label>
        </Pop>
      </Col>
    ),
  },
  {
    from: 14.6,
    to: 22.3,
    name: "Pregunta",
    el: (
      <Col gap={18}>
        <Pop at={18.0} from="up">
          <Title size={56}>¿Es una alternativa viable?</Title>
        </Pop>
        <Row gap={60}>
          <Pop at={18.6} from="left">
            <Col>
              <Emoji e="🧪" size={140} />
              <Label>Carne cultivada</Label>
            </Col>
          </Pop>
          <Pop at={19.4}>
            <Pulse>
              <Title size={90} color={Y}>VS</Title>
            </Pulse>
          </Pop>
          <Pop at={20.2} from="right">
            <Col>
              <Emoji e="🐄" size={140} />
              <Label>Ganadería tradicional</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 22.3,
    to: 31.6,
    name: "Demanda",
    el: (
      <Row gap={110}>
        <Pop at={22.6} from="up">
          <Col>
            <Row gap={6}>
              <Emoji e="👨‍👩‍👧‍👦" size={110} />
              <Title size={110} color={G}>↑</Title>
            </Row>
            <Label size={42}>La demanda crece</Label>
          </Col>
        </Pop>
        <Pop at={24.0} from="up">
          <Col>
            <Row gap={6}>
              <Emoji e="🌾" size={110} />
              <Title size={110} color={R}>↓</Title>
            </Row>
            <Label size={42}>Los recursos se limitan</Label>
          </Col>
        </Pop>
      </Row>
    ),
  },
  {
    from: 31.6,
    to: 42.6,
    name: "Ganadería e impacto",
    el: (
      <Col gap={20}>
        <Row gap={50}>
          <Pop at={32.6}>
            <Col>
              <Emoji e="🐄🐄🐄" size={100} />
              <Label>Grandes extensiones de tierra</Label>
            </Col>
          </Pop>
          <Pop at={40.0}>
            <Col>
              <Emoji e="🏭💨" size={100} />
              <Label>Gases de efecto invernadero</Label>
            </Col>
          </Pop>
        </Row>
        <Pop at={36.4} from="up">
          <Chip color={Y}>Según la FAO</Chip>
        </Pop>
      </Col>
    ),
  },
  {
    from: 42.6,
    to: 53.8,
    name: "Agricultura celular",
    el: (
      <Col gap={22}>
        <Pop at={43.3} from="up">
          <Title size={70}>Agricultura celular</Title>
        </Pop>
        <Row gap={70}>
          <Pop at={46.6}>
            <Col>
              <Emoji e="🌍" size={120} />
              <Label color={G}>Medio ambiente</Label>
            </Col>
          </Pop>
          <Pop at={48.0}>
            <Col>
              <Emoji e="❤️" size={120} />
              <Label color={G}>Salud humana</Label>
            </Col>
          </Pop>
          <Pop at={51.0}>
            <Col>
              <Cross at={52.4} size={120}>
                <Emoji e="🐖" size={110} />
              </Cross>
              <Label color={G}>Sin animales de granja</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 53.8,
    to: 69.9,
    name: "Cómo se hace",
    el: (
      <Col gap={26}>
        <Pop at={54.0} from="up">
          <Title size={56}>¿Cómo se hace? 🔬</Title>
        </Pop>
        <Row gap={18}>
          <Pop at={55.2}>
            <Col>
              <Emoji e="🐮" size={100} />
              <Label size={28}>1. Células de la piel</Label>
            </Col>
          </Pop>
          <Arrow at={57.2} />
          <Pop at={57.6}>
            <Col>
              <Emoji e="⚗️" size={100} />
              <Label size={28}>2. Biorreactor + nutrientes</Label>
            </Col>
          </Pop>
          <Arrow at={61.3} />
          <Pop at={61.8}>
            <Col>
              <Emoji e="🦠🦠" size={100} />
              <Label size={28}>3. Se multiplican</Label>
            </Col>
          </Pop>
          <Arrow at={64.6} />
          <Pop at={65.4}>
            <Col>
              <Emoji e="💪" size={100} />
              <Label size={28}>4. Fibras musculares</Label>
            </Col>
          </Pop>
          <Arrow at={67.4} />
          <Pop at={67.8}>
            <Col>
              <Emoji e="🥩" size={100} />
              <Label size={28}>¡Corte de carne!</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 69.9,
    to: 82.6,
    name: "Singapur",
    el: (
      <Col gap={20}>
        <Row gap={60}>
          <Pop at={70.6}>
            <Col>
              <Emoji e="📅" size={110} />
              <Label size={40} color={Y}>Diciembre 2020</Label>
            </Col>
          </Pop>
          <Pop at={72.6}>
            <Col>
              <Emoji e="🇸🇬" size={110} />
              <Label size={40}>Singapur</Label>
            </Col>
          </Pop>
          <Pop at={73.8}>
            <Col>
              <Emoji e="🍗" size={110} />
              <Label size={40}>Nuggets de Eat Just</Label>
            </Col>
          </Pop>
        </Row>
        <Pop at={76.5} from="up">
          <Chip color={G} style={{ fontSize: 38 }}>🏆 Primer país en aprobar carne cultivada</Chip>
        </Pop>
      </Col>
    ),
  },
  {
    from: 82.6,
    to: 90.6,
    name: "Pros y contras",
    el: (
      <Col gap={20}>
        <Pop at={83.0}>
          <Emoji e="🚀" size={110} />
        </Pop>
        <Pop at={85.6} from="up">
          <Title size={58}>Parece que vivimos en el futuro…</Title>
        </Pop>
        <Row gap={40}>
          <Pop at={88.6} from="left">
            <Chip color={G}>👍 PROS</Chip>
          </Pop>
          <Pop at={89.2}>
            <Emoji e="⚖️" size={90} />
          </Pop>
          <Pop at={89.6} from="right">
            <Chip color={R}>👎 CONTRAS</Chip>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 90.6,
    to: 103.4,
    name: "Universidad de Oxford",
    el: (
      <Col gap={20}>
        <Pop at={91.0} from="up">
          <Chip color={G}>👍 Menor impacto ambiental</Chip>
        </Pop>
        <Pop at={94.6} from="up">
          <Label size={38} color={Y}>🎓 Universidad de Oxford</Label>
        </Pop>
        <Row gap={110}>
          <Pop at={97.0}>
            <Col gap={4}>
              <Counter at={97.0} to={87} prefix="-" suffix="%" />
              <Label>gases de efecto invernadero 💨</Label>
            </Col>
          </Pop>
          <Pop at={100.4}>
            <Col gap={4}>
              <Counter at={100.4} to={99} prefix="-" suffix="%" />
              <Label>uso de suelo 🌱</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 103.4,
    to: 111.0,
    name: "Entorno limpio",
    el: (
      <Col gap={20}>
        <Pop at={103.7} from="up">
          <Title size={60}>Un entorno limpio ✨</Title>
        </Pop>
        <Row gap={120}>
          <Pop at={104.8}>
            <Col>
              <Cross at={105.6}>
                <Emoji e="💊" size={130} />
              </Cross>
              <Label>Sin antibióticos rutinarios</Label>
            </Col>
          </Pop>
          <Pop at={107.4}>
            <Col>
              <Cross at={108.6}>
                <Emoji e="🦠" size={130} />
              </Cross>
              <Label>Sin patógenos como E. coli</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 111.0,
    to: 121.6,
    name: "¿Y el dinero?",
    el: (
      <Col gap={24}>
        <Row gap={30}>
          <Pop at={112.4}>
            <Chip color={G}>✅ Apoyo ecológico</Chip>
          </Pop>
          <Pop at={113.6}>
            <Chip color={G}>✅ Apoyo sanitario</Chip>
          </Pop>
        </Row>
        <Pop at={115.6}>
          <Pulse>
            <Emoji e="💰❓" size={130} />
          </Pulse>
        </Pop>
        <Pop at={116.4} from="up">
          <Title size={54}>¿Es viable en términos de dinero?</Title>
        </Pop>
      </Col>
    ),
  },
  {
    from: 121.6,
    to: 132.6,
    name: "Costos y energía",
    el: (
      <Col gap={20}>
        <Pop at={122.6} from="up">
          <Title size={60} color={R}>El problema: costos y energía</Title>
        </Pop>
        <Row gap={70}>
          <Pop at={125.0}>
            <Col>
              <Emoji e="💸💸" size={110} />
              <Label>¡Carísimo de producir!</Label>
            </Col>
          </Pop>
          <Pop at={126.8}>
            <Col>
              <Emoji e="🎓" size={110} />
              <Label>UC Davis advierte</Label>
            </Col>
          </Pop>
          <Pop at={129.2}>
            <Col>
              <Emoji e="🛢️👣" size={110} />
              <Label>Con energía fósil, ¿más huella que el ganado?</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 132.6,
    to: 144.8,
    name: "Solo carne picada",
    el: (
      <Row gap={90}>
        <Col gap={14}>
          <Row gap={30}>
            <Pop at={133.4}>
              <Col>
                <Cross at={135.4} size={150}>
                  <Emoji e="🥩" size={120} />
                </Cross>
                <Label>Corte entero</Label>
              </Col>
            </Pop>
            <Pop at={136.6}>
              <Col>
                <Emoji e="🍔" size={130} />
                <Label color={G}>Carne picada ✓</Label>
              </Col>
            </Pop>
          </Row>
        </Col>
        <Pop at={137.8} from="right">
          <Col>
            <Emoji e="🤢" size={140} />
            <Label size={40} color={Y}>Rechazo psicológico</Label>
            <Pop at={143.4}>
              <Chip color={R}>"Es artificial"</Chip>
            </Pop>
          </Col>
        </Pop>
      </Row>
    ),
  },
  {
    from: 144.8,
    to: 154.8,
    name: "Energía renovable",
    el: (
      <Col gap={20}>
        <Pop at={146.8} from="up">
          <Title size={60}>Las empresas migran a energía renovable</Title>
        </Pop>
        <Row gap={50}>
          <Pop at={149.4}>
            <Emoji e="☀️" size={120} />
          </Pop>
          <Pop at={149.8}>
            <Emoji e="🌬️" size={120} />
          </Pop>
          <Pop at={150.2}>
            <Emoji e="🔋" size={120} />
          </Pop>
        </Row>
        <Pop at={152.0} from="up">
          <Chip color={G}>Con el tiempo, menos huella 👣</Chip>
        </Pop>
      </Col>
    ),
  },
  {
    from: 154.8,
    to: 164.7,
    name: "Crisis climática",
    el: (
      <Col gap={20}>
        <Row gap={50}>
          <Pop at={156.4}>
            <Emoji e="🌡️🌍🔥" size={120} />
          </Pop>
        </Row>
        <Pop at={156.8} from="up">
          <Title size={56}>Crisis climática actual</Title>
        </Pop>
        <Pop at={158.6} from="up">
          <Label size={40} color={Y}>¿Depender de un futuro incierto? 🤔</Label>
        </Pop>
        <Pop at={162.8}>
          <Chip color={G}>♟️ ¡Grandes cambios = jugadas grandes!</Chip>
        </Pop>
      </Col>
    ),
  },
  {
    from: 164.7,
    to: 179.7,
    name: "Picada y nuggets",
    el: (
      <Col gap={20}>
        <Pop at={165.0} from="up">
          <Title size={56}>Por ahora: carne picada 🍔</Title>
        </Pop>
        <Pop at={169.6} from="up">
          <Label size={36}>🧬 La biotecnología avanza hacia el corte tradicional</Label>
        </Pop>
        <Row gap={40}>
          <Pop at={174.0}>
            <Emoji e="🍔" size={110} />
          </Pop>
          <Pop at={174.6}>
            <Emoji e="🍗" size={110} />
          </Pop>
          <Pop at={176.6} from="right">
            <Chip color={G}>Lo más viable y económico a corto plazo</Chip>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 179.7,
    to: 187.1,
    name: "Un corte es complejo",
    el: (
      <Col gap={22}>
        <Pop at={179.9}>
          <Emoji e="🥩" size={120} />
        </Pop>
        <Row gap={20}>
          <Pop at={180.8} from="up">
            <Chip color={R}>Fibras</Chip>
          </Pop>
          <Pop at={181.4} from="up">
            <Chip color={Y}>Grasas</Chip>
          </Pop>
          <Pop at={182.0} from="up">
            <Chip color="#c9a7ff">Tejido conectivo</Chip>
          </Pop>
        </Row>
        <Pop at={183.8} from="up">
          <Label size={40}>⚗️ Los biorreactores aún no soportan tanto estrés 😰</Label>
        </Pop>
      </Col>
    ),
  },
  {
    from: 187.1,
    to: 203.0,
    name: "Darle tiempo",
    el: (
      <Col gap={20}>
        <Row gap={50}>
          <Pop at={187.4}>
            <Col>
              <Emoji e="⏳" size={120} />
              <Label>Darle unos años</Label>
            </Col>
          </Pop>
          <Pop at={189.0}>
            <Col>
              <Emoji e="🌟" size={120} />
              <Label color={G}>Solución prometedora</Label>
            </Col>
          </Pop>
        </Row>
        <Row gap={30}>
          <Pop at={197.0} from="up">
            <Chip color={R}>💸 Costo innegable</Chip>
          </Pop>
          <Pop at={199.4} from="up">
            <Chip color={Y}>🤢 Rechazo al principio</Chip>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 203.0,
    to: 211.9,
    name: "La gran pregunta",
    el: (
      <Col gap={20}>
        <Pop at={203.4} from="up">
          <Label size={40} color={Y}>LA PREGUNTA FINAL</Label>
        </Pop>
        <Pop at={209.6}>
          <Pulse amount={0.03}>
            <Title size={84}>¿Es viable la carne cultivada?</Title>
          </Pulse>
        </Pop>
      </Col>
    ),
  },
  {
    from: 211.9,
    to: 256.5,
    name: "Veredictos",
    el: (
      <Col gap={18}>
        <Pop at={212.0} from="up">
          <Title size={46}>Los veredictos</Title>
        </Pop>
        <Row gap={34} style={{ alignItems: "stretch" }}>
          <Verdict at={212.4} who="valen" icon="✅" title="Sí, a mediano y largo plazo" note="Responde a la demanda mundial" />
          <Verdict at={229.4} who="rashid" icon="🤏" title="Viable, pero hoy solo un complemento" note="No podría comer carne artificial" />
          <Verdict at={242.4} who="max" icon="🚀" title="Viable: ¡solución revolucionaria!" note="Menos sacrificio animal y menos gases" />
        </Row>
      </Col>
    ),
  },
  {
    from: 256.5,
    to: 272.4,
    name: "¿Y vos?",
    el: (
      <Col gap={22}>
        <Pop at={259.2} from="up">
          <Label size={40}>💬 Déjennos su opinión en los comentarios</Label>
        </Pop>
        <Pop at={263.3} from="up">
          <Title size={60}>¿Comerías carne cultivada?</Title>
        </Pop>
        <Row gap={50}>
          <Pop at={264.6} from="left">
            <Chip color={G} style={{ fontSize: 44 }}>🧪 Cultivada</Chip>
          </Pop>
          <Pop at={265.4} from="right">
            <Chip color={Y} style={{ fontSize: 44 }}>🐄 Tradicional</Chip>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 272.4,
    to: 286.5,
    name: "Próximos temas",
    el: (
      <Col gap={22}>
        <Pop at={272.8} from="up">
          <Title size={58}>¿Qué tema quieren para el próximo capítulo?</Title>
        </Pop>
        <Row gap={50}>
          <Pop at={274.8}>
            <Emoji e="💡" size={110} />
          </Pop>
          <Pop at={278.4}>
            <Col>
              <Emoji e="🧑‍🤝‍🧑" size={110} />
              <Label>¿Invitados?</Label>
            </Col>
          </Pop>
          <Pop at={282.4}>
            <Emoji e="📝" size={110} />
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 286.5,
    to: 298.5,
    name: "Dato curioso: mamut",
    el: (
      <Col gap={18}>
        <Pop at={286.8} from="up">
          <Chip color={Y} style={{ fontSize: 40 }}>🤯 DATO CURIOSO</Chip>
        </Pop>
        <Row gap={40}>
          <Pop at={292.4}>
            <Col>
              <Emoji e="🇦🇺" size={100} />
              <Label>Vow, 2023</Label>
            </Col>
          </Pop>
          <Pop at={294.4}>
            <Emoji e="🧆" size={130} />
          </Pop>
          <Pop at={295.6}>
            <Col>
              <Emoji e="🦣" size={130} />
              <Label>¡de mamut!</Label>
            </Col>
          </Pop>
        </Row>
        <Pop at={294.6} from="up">
          <Title size={50}>Una albóndiga de carne de mamut</Title>
        </Pop>
      </Col>
    ),
  },
  {
    from: 298.5,
    to: 314.4,
    name: "Cómo hicieron el mamut",
    el: (
      <Col gap={22}>
        <Pop at={298.7} from="up">
          <Title size={52}>¿Cómo lo hicieron? 🧬</Title>
        </Pop>
        <Row gap={18}>
          <Pop at={299.8}>
            <Col>
              <Emoji e="🦣🧬" size={90} />
              <Label size={28}>ADN de mamut</Label>
            </Col>
          </Pop>
          <Pop at={301.6}>
            <Title size={60}>+</Title>
          </Pop>
          <Pop at={301.8}>
            <Col>
              <Emoji e="🐘🧬" size={90} />
              <Label size={28}>ADN de elefante</Label>
            </Col>
          </Pop>
          <Arrow at={303.6} />
          <Pop at={304.6}>
            <Col>
              <Emoji e="🐑" size={90} />
              <Label size={28}>Células de oveja</Label>
            </Col>
          </Pop>
          <Arrow at={307.2} />
          <Pop at={307.6}>
            <Col>
              <Counter at={307.8} to={20} suffix="M" size={90} color={Y} />
              <Label size={28}>millones de células</Label>
            </Col>
          </Pop>
          <Arrow at={310.6} />
          <Pop at={311.6}>
            <Col>
              <Emoji e="🧆" size={90} />
              <Label size={28}>Carne de mamut</Label>
            </Col>
          </Pop>
        </Row>
      </Col>
    ),
  },
  {
    from: 314.4,
    to: 400,
    name: "Despedida",
    el: (
      <Col gap={20}>
        <Pop at={314.6}>
          <Emoji e="👋" size={140} />
        </Pop>
        <Pop at={315.0} from="up">
          <Title size={84}>¡Gracias por ver!</Title>
        </Pop>
        <Pop at={316.0} from="up">
          <Label size={44} color={Y}>Hasta la próxima 🎙️</Label>
        </Pop>
      </Col>
    ),
  },
];

