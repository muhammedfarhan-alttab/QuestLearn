'use client';
import React from 'react';
import { SimulationModelType, PracticalModelConfig } from '../../data/practicalModelsData';
import { DerivedLabMetrics } from '../../lib/labExplanationEngine';
import KinematicsMotionSim from './KinematicsMotionSim';
import ForceSimulationSim from './ForceSimulationSim';
import EnergySimulationSim from './EnergySimulationSim';
import CollisionSimulationSim from './CollisionSimulationSim';
import RotationalSimulationSim from './RotationalSimulationSim';
import LorentzSimulationSim from './LorentzSimulationSim';
import ConceptLabSim from './ConceptLabSim';

interface SimulationRegistryProps {
  modelType: SimulationModelType;
  params: Record<string, number>;
  derived: DerivedLabMetrics;
  modelConfig?: PracticalModelConfig;
  onParamChange?: (key: string, value: number) => void;
}

/**
 * Safe Predefined Simulation Component Registry.
 * Guarantees zero dynamic code evaluation. Strictly maps modelType
 * strings to safe, verified interactive React simulation components.
 */
export default function SimulationRegistry({
  modelType,
  params,
  derived,
  modelConfig,
  onParamChange
}: SimulationRegistryProps) {
  switch (modelType) {
    case 'kinematics_motion':
      return <KinematicsMotionSim params={params} derived={derived} onParamChange={onParamChange} />;

    case 'force_simulation':
      return <ForceSimulationSim params={params} derived={derived} />;

    case 'energy_simulation':
      return <EnergySimulationSim params={params} derived={derived} />;

    case 'collision_simulation':
      return <CollisionSimulationSim params={params} derived={derived} />;

    case 'rotational_simulation':
      return <RotationalSimulationSim params={params} derived={derived} />;

    case 'lorentz_simulation':
      return <LorentzSimulationSim params={params} derived={derived} onParamChange={onParamChange} />;

    case 'concept_lab':
    default:
      return <ConceptLabSim params={params} derived={derived} modelConfig={modelConfig} />;
  }
}
