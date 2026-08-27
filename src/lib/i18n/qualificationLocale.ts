import type { AppLocale } from '@/store/localeStore';
import type { QualificationQuestion, QuestionId } from '@/types/qualification.types';

const KO: Record<QuestionId, { prompt: string; helper?: string; options: Record<string, string> }> = {
  Q1: { prompt: '현재 이 계산은 어디에서 실행되고 있나요?', helper: '가장 가까운 환경을 선택하세요.', options: { matlab_julia:'MATLAB / Julia', python_scipy:'Python / SciPy / NumPy', r_sas:'R / SAS', simulink_modelica:'Simulink / Modelica', cae:'CAE (ANSYS / Abaqus / COMSOL / OpenFOAM)', ai_ml:'PyTorch / TensorFlow / JAX', native:'C / C++ / Fortran / CUDA', hardware:'맞춤형 하드웨어 / 런타임', other:'기타' } },
  Q2: { prompt: '무엇의 비용 부담이 커지고 있나요?', helper: '해당되는 항목을 모두 선택하세요.', options: { cost:'비용', speed:'속도', stability_accuracy:'안정성 및 정확도', energy:'에너지', hardware_utilization:'하드웨어 활용', architecture:'아키텍처', memory_data_movement:'메모리 및 데이터 이동' } },
  Q3: { prompt: '워크로드에는 어떤 구조가 포함되어 있나요?', options: { linear_algebra:'밀집 / 복소 선형대수', conservation:'보존 법칙 또는 수송 동역학', state_observation:'부분 관측을 사용하는 상태 추정', mixed:'위 항목의 혼합', unsure:'아직 잘 모르겠습니다' } },
  Q4: { prompt: '컴퓨트에 대해 다른 답이 필요한 시점은 언제인가요?', options: { now:'이미 업무를 가로막고 있습니다', quarter:'이번 분기', year:'1년 이내', exploring:'탐색 중입니다' } },
  Q5: { prompt: '현재 병목의 심각도는 어느 정도인가요?', options: { critical:'매우 심각 — 가능한 범위를 제한합니다', significant:'상당함 — 업무 속도를 늦춥니다', moderate:'보통 — 현재는 관리 가능합니다', minor:'경미함' } },
  Q6: { prompt: '조직을 가장 잘 설명하는 항목은 무엇인가요?', options: { hardware_chip:'하드웨어 / 칩 / 가속기', cloud_infra:'클라우드 또는 인프라 제공자', enterprise_rd:'기업 R&D / 엔지니어링', research:'연구 기관', individual:'개인 / 독립 활동' } },
  Q7: { prompt: '이 의사결정에서 어떤 역할을 맡고 있나요?', options: { decision_maker:'제가 결정합니다', influencer:'의사결정에 영향을 줍니다', evaluator:'옵션을 평가합니다', curious:'개인적인 관심입니다' } },
  Q8: { prompt: '이 문제 해결을 위한 예산은 어느 단계인가요?', options: { allocated:'예산이 배정되어 있습니다', planning:'계획 중 / 근거를 만들고 있습니다', none_yet:'아직 예산이 없습니다' } },
  Q9: { prompt: '기반 기술 라이선싱에 관심이 있나요?', helper:'라이선스 조건은 항상 담당 팀이 다루며 여기에서 견적을 제시하지 않습니다.', options: { exclusive:'예 — 독점 / 전략적 형태 가능', non_exclusive:'예 — 비독점', product_only:'현재는 제품 사용만', unsure:'잘 모르겠습니다' } },
};

export function localizedQuestion(question: QualificationQuestion, locale: AppLocale): QualificationQuestion {
  if (locale !== 'ko') return question;
  const q = KO[question.id];
  return { ...question, prompt: q.prompt, helper: q.helper, options: question.options.map((o) => ({ ...o, label: q.options[o.value] ?? o.label })) };
}

export function qualificationUi(locale: AppLocale) {
  return locale === 'ko' ? {
    required: '계속하려면 옵션을 선택하거나 “잘 모르겠습니다”를 선택하세요.', back:'← 이전', continue:'계속 →', prepare:'내 리뷰 준비',
    notSure:'잘 모르겠습니다', stage1:'1 / 2 단계', stage2:'2 / 2 단계',
    eyebrow1:'워크로드에 대해 몇 가지만 알려주세요', eyebrow2:'적절한 경로를 찾기 위해 조금 더 알려주세요',
    liveStage2:'몇 가지 질문을 더 드리겠습니다.', title:'컴퓨트 병목 리뷰',
  } : {
    required:'Select an option, or choose “Not sure,” to continue.', back:'← Back', continue:'Continue →', prepare:'Prepare my review', notSure:'Not sure',
    stage1:'Step 1 of 2', stage2:'Step 2 of 2', eyebrow1:'A few words about the workload', eyebrow2:'A little more, to route you well',
    liveStage2:'A few more questions, now that you have asked for more.', title:'Compute Bottleneck Review',
  };
}
