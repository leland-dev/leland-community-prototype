/** Leland logo loader — stationary geometry, traveling ink.
 *  `bg` must match the surface behind it. */
const MARKUP = `<!-- Leland Logo Loader — self-contained embed.
  Vars on .ll-loader: --ll-ink, --ll-bg (must match surface), --ll-size, --ll-dur -->
<div class="ll-loader" role="img" aria-label="Loading">
<svg class="ll-svg" viewBox="-280 -15 1520 1900">
        <g clip-path="url(#ll-clip)">
          <path class="barline" d="M 430.7 -70 L -0.4 853.8"/>
          <path class="barline" d="M 676.7 -70 L 177.7 999.3"/>
            <path class="cut" d="M 479.5 1127.0 L -294.4 491.6 L -505.3 953.4 L -460.2 1469.0 Z"/>
            <path class="cut" d="M 304.2 -4.2 L 326.0 0 A 30 30 0 0 0 298.8 17.3 Z"/>
            <path class="cut" d="M 739.3 -2.7 L 688.0 0 A 30 30 0 0 1 715.2 42.7 Z"/>
            <rect class="cover cA" x="-1080" y="-40" width="5200" height="3240"><animateTransform class="sw" attributeName="transform" type="rotate" dur="8s" repeatCount="indefinite" calcMode="spline"
                values="0 -879.4 0;0 -879.4 0;42.5 -879.4 0;42.5 -879.4 0;0 -879.4 0;0 -879.4 0"
                keyTimes="0;.02;.09;.795;.855;1"
                keySplines="0 0 1 1;.6 .04 .22 1;0 0 1 1;.65 .05 .45 1;0 0 1 1"/></rect>
            <rect class="cover cB" x="-1080" y="-3200" width="5200" height="3200"><animateTransform class="sw" attributeName="transform" type="rotate" dur="8s" repeatCount="indefinite" calcMode="spline"
                values="0 -879.4 0;0 -879.4 0;40.5 -879.4 0;40.5 -879.4 0;-1.2 -879.4 0;0 -879.4 0;0 -879.4 0"
                keyTimes="0;.105;.165;.48;.54;.57;1"
                keySplines="0 0 1 1;.65 .05 .45 1;0 0 1 1;.25 .8 .4 1;.5 0 .5 1;0 0 1 1"/></rect>
            <path class="cutA" d="M 302.5 466.3 A 684 684 0 0 1 1046.6 744.5" stroke-width="78"/>
            <path class="cutB" d="M 128.2 842.5 A 452 452 0 0 1 804.7 813.0" stroke-width="78"/>
            <path class="ln uarc" d="M 879.7 722.6 A 569 569 0 0 0 79.3 1531.4 A 569 569 0 0 0 879.7 722.6 A 569 569 0 0 0 79.3 1531.4 A 569 569 0 0 0 879.7 722.6 A 569 569 0 0 0 41.6 763.6"/>
            <path class="ln larc" d="M 715.1 888.9 A 335 335 0 0 0 243.9 1365.1 A 335 335 0 0 0 715.1 888.9 A 335 335 0 0 0 243.9 1365.1 A 335 335 0 0 0 715.1 888.9 A 335 335 0 0 0 221.6 913.0"/>
            <path class="bite biteA" d="M -30.2 713.1 L -15.4 690.9 A 30 30 0 0 0 -7.3 726.8 Z"/>
            <path class="bite biteB" d="M 946.6 660.0 L 920.3 638.9 A 30 30 0 0 1 920.5 681.3 Z"/>
            <path class="bite biteC" d="M 289.9 974.3 L 306.0 949.2 A 26 26 0 0 1 269.4 952.7 Z"/>
            <path class="bite biteB" d="M 653.2 956.4 L 634.7 933.1 A 26 26 0 0 0 671.5 932.9 Z"/>
        </g>
      </svg>
</div>
<style>
.ll-loader{--ll-ink:#111111;--ll-bg:#F8F7F4;--ll-size:230px;--ll-dur:8s;
  display:inline-block;width:var(--ll-size);line-height:0;
  --ink:var(--ll-ink);--bg:var(--ll-bg);--dur:var(--ll-dur)}
.ll-svg{width:100%;height:auto;display:block;overflow:visible}
.ln{
    fill:none;
    stroke:var(--ink);
    stroke-linecap:butt;
    transition:stroke .3s ease;
    animation-duration:var(--dur);
    animation-iteration-count:infinite;
  }
.uarc{stroke-width:176;stroke-dasharray:941 9200;stroke-dashoffset:0;animation-name:ll-uarc}
.larc{stroke-width:176;stroke-dasharray:553 5500;stroke-dashoffset:0;animation-name:ll-larc}
.barline{fill:none;stroke:var(--ink);stroke-width:165;transition:stroke .3s ease}
.cover{fill:var(--bg);transition:fill .3s ease}
.cut{stroke:var(--bg);fill:var(--bg);transition:stroke .3s ease,fill .3s ease}
.bite{fill:var(--bg);transition:fill .3s ease;opacity:0;
        animation-duration:var(--dur);animation-iteration-count:infinite}
  .biteA{animation-name:ll-biteA}
  .biteB{animation-name:ll-biteB}
  .biteC{animation-name:ll-biteC}
  /* corner rounds only exist while their corner is occupied by resting
     geometry; every toggle lands on a frame where that spot is empty,
     so passing lap ink is never nibbled and no toggle is ever visible. */
  @keyframes ll-biteA{
    0%,0.5%    {opacity:0}
    1.5%,16.5% {opacity:1}
    17.5%,46.5%{opacity:0}
    47.5%,85.5%{opacity:1}
    86.5%,100% {opacity:0}
  }
.biteA{animation-name:ll-biteA}
.biteB{animation-name:ll-biteB}
.biteC{animation-name:ll-biteC}
@keyframes ll-biteA{
    0%,0.5%    {opacity:0}
    1.5%,16.5% {opacity:1}
    17.5%,46.5%{opacity:0}
    47.5%,85.5%{opacity:1}
    86.5%,100% {opacity:0}
  }
@keyframes ll-biteB{
    0%,34.5%  {opacity:0}
    35.5%,79.5%{opacity:1}
    80.5%,100%{opacity:0}
  }
@keyframes ll-biteC{
    0%,46.5%  {opacity:0}
    47.5%,79.5%{opacity:1}
    80.5%,100%{opacity:0}
  }
.cutA,.cutB{fill:none;stroke:var(--bg);transition:stroke .3s ease;opacity:0;
          animation-duration:var(--dur);animation-iteration-count:infinite}
.cutA{stroke-dasharray:848 3000;animation-name:ll-cutA}
.cutB{fill:none;stroke:var(--bg);transition:stroke .3s ease;opacity:0;
          animation-duration:var(--dur);animation-iteration-count:infinite}
@keyframes ll-uarc{
    0%,17.5% {stroke-dashoffset:-8104; stroke-dasharray:941 9200; animation-timing-function:linear}
    18.25% {stroke-dashoffset:-7839; animation-timing-function:linear}
    19.00% {stroke-dashoffset:-7621; animation-timing-function:linear}
    19.75% {stroke-dashoffset:-7408; animation-timing-function:linear}
    20.50% {stroke-dashoffset:-7166; animation-timing-function:linear}
    21.25% {stroke-dashoffset:-6861; animation-timing-function:linear}
    22.00% {stroke-dashoffset:-6471; animation-timing-function:linear}
    22.75% {stroke-dashoffset:-6001; animation-timing-function:linear}
    23.50% {stroke-dashoffset:-5503; animation-timing-function:linear}
    24.25% {stroke-dashoffset:-5048; animation-timing-function:linear}
    25.00% {stroke-dashoffset:-4678; animation-timing-function:linear}
    25.75% {stroke-dashoffset:-4390; animation-timing-function:linear}
    26.50% {stroke-dashoffset:-4157; animation-timing-function:linear}
    27.25% {stroke-dashoffset:-3946; animation-timing-function:linear}
    28.00% {stroke-dashoffset:-3723; animation-timing-function:linear}
    28.75% {stroke-dashoffset:-3454; animation-timing-function:linear}
    29.50% {stroke-dashoffset:-3110; animation-timing-function:linear}
    30.25% {stroke-dashoffset:-2679; animation-timing-function:linear}
    31.00% {stroke-dashoffset:-2186; animation-timing-function:linear}
    31.75% {stroke-dashoffset:-1700; animation-timing-function:linear}
    32.50% {stroke-dashoffset:-1284; animation-timing-function:linear}
    33.25% {stroke-dashoffset:-956; animation-timing-function:linear}
    34.00% {stroke-dashoffset:-698; animation-timing-function:linear}
    34.75% {stroke-dashoffset:-480; animation-timing-function:linear}
    35.50% {stroke-dashoffset:-267; animation-timing-function:linear}
    36.25% {stroke-dashoffset:-81; animation-timing-function:linear}
    37%      {stroke-dashoffset:0; animation-timing-function:cubic-bezier(.3,.3,.6,1)}
    41%      {stroke-dashoffset:950; animation-timing-function:linear}   /* tail piles into 2:00 -> blank */
    42%      {stroke-dashoffset:950; animation-timing-function:cubic-bezier(.3,.5,.25,1)}
    47.5%    {stroke-dashoffset:0; animation-timing-function:linear}          /* pours CCW to the corner */
    72%      {stroke-dashoffset:0; stroke-dasharray:941 9200; animation-timing-function:cubic-bezier(.55,.05,.55,1)}
    79%      {stroke-dashoffset:-940.5; stroke-dasharray:0.5 9200; animation-timing-function:steps(1,end)} /* collapses 2 -> corner */
    80%,100% {stroke-dashoffset:-8104; stroke-dasharray:941 9200}
  }
@keyframes ll-larc{
    0%,17.5% {stroke-dashoffset:-4775; stroke-dasharray:553 5500; animation-timing-function:linear}
    18.25% {stroke-dashoffset:-4615; animation-timing-function:linear}
    19.00% {stroke-dashoffset:-4487; animation-timing-function:linear}
    19.75% {stroke-dashoffset:-4361; animation-timing-function:linear}
    20.50% {stroke-dashoffset:-4219; animation-timing-function:linear}
    21.25% {stroke-dashoffset:-4039; animation-timing-function:linear}
    22.00% {stroke-dashoffset:-3810; animation-timing-function:linear}
    22.75% {stroke-dashoffset:-3533; animation-timing-function:linear}
    23.50% {stroke-dashoffset:-3240; animation-timing-function:linear}
    24.25% {stroke-dashoffset:-2972; animation-timing-function:linear}
    25.00% {stroke-dashoffset:-2754; animation-timing-function:linear}
    25.75% {stroke-dashoffset:-2584; animation-timing-function:linear}
    26.50% {stroke-dashoffset:-2447; animation-timing-function:linear}
    27.25% {stroke-dashoffset:-2323; animation-timing-function:linear}
    28.00% {stroke-dashoffset:-2192; animation-timing-function:linear}
    28.75% {stroke-dashoffset:-2033; animation-timing-function:linear}
    29.50% {stroke-dashoffset:-1831; animation-timing-function:linear}
    30.25% {stroke-dashoffset:-1577; animation-timing-function:linear}
    31.00% {stroke-dashoffset:-1287; animation-timing-function:linear}
    31.75% {stroke-dashoffset:-1001; animation-timing-function:linear}
    32.50% {stroke-dashoffset:-756; animation-timing-function:linear}
    33.25% {stroke-dashoffset:-562; animation-timing-function:linear}
    34.00% {stroke-dashoffset:-411; animation-timing-function:linear}
    34.75% {stroke-dashoffset:-282; animation-timing-function:linear}
    35.50% {stroke-dashoffset:-157; animation-timing-function:linear}
    36.25% {stroke-dashoffset:-47; animation-timing-function:linear}
    37%      {stroke-dashoffset:0; animation-timing-function:cubic-bezier(.3,.3,.6,1)}
    41%      {stroke-dashoffset:560; animation-timing-function:linear}   /* tail piles into 2:00 -> blank */
    42%      {stroke-dashoffset:560; animation-timing-function:cubic-bezier(.3,.5,.25,1)}
    47.5%    {stroke-dashoffset:0; animation-timing-function:linear}          /* pours CCW to the corner */
    72%      {stroke-dashoffset:0; stroke-dasharray:553 5500; animation-timing-function:cubic-bezier(.55,.05,.55,1)}
    79%      {stroke-dashoffset:-552.5; stroke-dasharray:0.5 5500; animation-timing-function:steps(1,end)} /* collapses 2 -> corner */
    80%,100% {stroke-dashoffset:-4775; stroke-dasharray:553 5500}
  }
@keyframes ll-cutA{
    0%,46.5%  {opacity:0; stroke-dasharray:848 3000}
    47.5%,72% {opacity:1; stroke-dasharray:848 3000; animation-timing-function:cubic-bezier(.4,.1,.5,1)}
    76.5%     {opacity:1; stroke-dasharray:0.5 3000; animation-timing-function:steps(1,end)}
    80%,100%  {opacity:0; stroke-dasharray:848 3000}
  }
@keyframes ll-cutB{
    0%,46.5%  {opacity:0; stroke-dasharray:766 3000}
    47.5%,72% {opacity:1; stroke-dasharray:766 3000; animation-timing-function:cubic-bezier(.45,.1,.5,1)}
    77.8%     {opacity:1; stroke-dasharray:0.5 3000; animation-timing-function:steps(1,end)}
    80%,100%  {opacity:0; stroke-dasharray:766 3000}
  }
@media (prefers-reduced-motion: reduce){
    .ln{animation:none;stroke-dashoffset:0}
      .cover{animation:none;transform:translate(-599.4px,15px) rotate(40.5deg) translate(599.4px,-15px)}
  }
</style>
`;

type Props = { size?: number; ink?: string; bg?: string; duration?: number };

export default function LelandLoader({ size = 230, ink = "#111111", bg = "#F8F7F4", duration = 8 }: Props) {
  return (
    <span
      style={{
        ["--ll-size" as string]: size + "px",
        ["--ll-ink" as string]: ink,
        ["--ll-bg" as string]: bg,
        ["--ll-dur" as string]: duration + "s",
        display: "inline-block",
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: MARKUP }}
    />
  );
}
