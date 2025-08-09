'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateCreativeConcepts } from '@/lib/ai-service';

interface Company { id: string; name: string; }
interface Product { id: string; name: string; company_id: string; }
interface UserPersona { id: string; name: string; company_id: string; }

interface CreativeConcept {
  id: string;
  concept: string;
  copyOut: string;
  copyIn: string;
  cta: string;
  feedback: string;
  isEditing?: boolean;
}

export default function CreativeCampaignPage() {
  const supabase = createClientComponentClient();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const [userPersonas, setUserPersonas] = useState<UserPersona[]>([]);
  const [selectedUserPersona, setSelectedUserPersona] = useState<string | null>(null);

  const [campaignBrief, setCampaignBrief] = useState<string>('');
  const [noBriefCheckbox, setNoBriefCheckbox] = useState<boolean>(false);

  const [creativeConcepts, setCreativeConcepts] = useState<CreativeConcept[]>([]);
  const [loadingConcepts, setLoadingConcepts] = useState<boolean>(false);

  const handleConceptChange = (id: string, field: keyof CreativeConcept, value: string) => {
    setCreativeConcepts(prevConcepts =>
      prevConcepts.map(concept =>
        concept.id === id ? { ...concept, [field]: value } : concept
      )
    );
  };

  const handleEditConcept = (id: string) => {
    setCreativeConcepts(prevConcepts =>
      prevConcepts.map(concept =>
        concept.id === id ? { ...concept, isEditing: true } : concept
      )
    );
  };

  const handleSaveConcept = (id: string) => {
    setCreativeConcepts(prevConcepts =>
      prevConcepts.map(concept =>
        concept.id === id ? { ...concept, isEditing: false } : concept
      )
    );
    // Here you would typically save to a database or backend
    console.log(`Concept ${id} saved!`);
  };

  const handleCancelEdit = (id: string) => {
    setCreativeConcepts(prevConcepts =>
      prevConcepts.map(concept =>
        concept.id === id ? { ...concept, isEditing: false } : concept
      )
    );
    // Optionally, revert changes if not saved
  };

  const handleDeleteConcept = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este concepto?')) {
      setCreativeConcepts(prevConcepts => prevConcepts.filter(concept => concept.id !== id));
      // Here you would typically delete from a database or backend
      console.log(`Concept ${id} deleted!`);
    }
  };

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase.from('organizations').select('id, name');
      if (error) console.error('Error fetching companies:', error);
      else setCompanies(data || []);
    };
    fetchCompanies();
  }, [supabase]);

  // Fetch Products based on selected Company
  useEffect(() => {
    if (selectedCompany) {
      const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('id, name, organization_id').eq('organization_id', selectedCompany);
        if (error) console.error('Error fetching products:', error);
        else setProducts(data ? data.map(p => ({ ...p, company_id: p.organization_id })) : []);
      };
      fetchProducts();
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }
  }, [selectedCompany, supabase]);

  // Fetch User Personas based on selected Company
  useEffect(() => {
    if (selectedCompany) {
      const fetchUserPersonas = async () => {
        const { data, error } = await supabase.from('user_personas').select('id, name, organization_id').eq('organization_id', selectedCompany);
        if (error) console.error('Error fetching user personas:', error);
        else setUserPersonas(data ? data.map(up => ({ ...up, company_id: up.organization_id })) : []);
      };
      fetchUserPersonas();
    } else {
      setUserPersonas([]);
      setSelectedUserPersona(null);
    }
  }, [selectedCompany, supabase]);

  const handleGenerateConcepts = async (numToGenerate: number = 2) => {
    if (!selectedCompany || !selectedProduct || !selectedUserPersona) return;

    setLoadingConcepts(true);
    try {
      const company = companies.find(c => c.id === selectedCompany);
      const product = products.find(p => p.id === selectedProduct);
      const userPersona = userPersonas.find(up => up.id === selectedUserPersona);

      if (!company || !product || !userPersona) {
        console.error('Missing selected data for AI generation.');
        setLoadingConcepts(false);
        return;
      }

      const generated = await generateCreativeConcepts({
        companyName: company.name,
        productName: product.name,
        userPersonaName: userPersona.name,
        campaignBrief: noBriefCheckbox ? undefined : campaignBrief,
      }, numToGenerate);

      const newConcepts: CreativeConcept[] = generated.map(gc => ({
        id: `${Date.now()}-${Math.random()}`,
        concept: gc.concept,
        copyOut: gc.copyOut,
        copyIn: gc.copyIn,
        cta: gc.cta,
        feedback: '',
        isEditing: false,
      }));

      setCreativeConcepts(prev => [...prev, ...newConcepts]);
    } catch (error) {
      console.error('Error generating concepts:', error);
    } finally {
      setLoadingConcepts(false);
    }
  };

  const canGenerate = selectedCompany && selectedProduct && selectedUserPersona && (campaignBrief.trim() !== '' || noBriefCheckbox);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Generador de Conceptos Creativos</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle>1. Selección de Elementos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="company-select" className="mb-2 block">Compañía</Label>
              <Select onValueChange={setSelectedCompany} value={selectedCompany || ''}>
                <SelectTrigger id="company-select">
                  <SelectValue placeholder="Selecciona una compañía" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="product-select" className="mb-2 block">Producto</Label>
              <Select onValueChange={setSelectedProduct} value={selectedProduct || ''} disabled={!selectedCompany || products.length === 0}>
                <SelectTrigger id="product-select">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="user-persona-select" className="mb-2 block">User Persona</Label>
              <Select onValueChange={setSelectedUserPersona} value={selectedUserPersona || ''} disabled={!selectedCompany || userPersonas.length === 0}>
                <SelectTrigger id="user-persona-select">
                  <SelectValue placeholder="Selecciona una User Persona" />
                </SelectTrigger>
                <SelectContent>
                  {userPersonas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id}>{persona.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>2. Brief de Campaña</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="campaign-brief" className="mb-2 block">Brief de Campaña (opcional)</Label>
            <Textarea
              id="campaign-brief"
              placeholder="Describe tu campaña aquí..."
              value={campaignBrief}
              onChange={(e) => setCampaignBrief(e.target.value)}
              disabled={noBriefCheckbox}
              rows={5}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no-brief"
              checked={noBriefCheckbox}
              onCheckedChange={(checked: boolean) => {
                setNoBriefCheckbox(checked);
                if (checked) setCampaignBrief('');
              }}
            />
            <Label htmlFor="no-brief">No quiero incluir brief de campaña</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>3. Generación de Conceptos Creativos</CardTitle></CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button onClick={() => handleGenerateConcepts(2)} disabled={!canGenerate || loadingConcepts}>
              {loadingConcepts ? 'Generando 2...' : 'Generar 2 Conceptos'}
            </Button>
            <Button onClick={() => handleGenerateConcepts(3)} disabled={!canGenerate || loadingConcepts}>
              {loadingConcepts ? 'Generando 3...' : 'Generar 3 Conceptos'}
            </Button>
            {creativeConcepts.length > 0 && (
              <Button onClick={() => handleGenerateConcepts(1)} disabled={loadingConcepts} variant="outline">
                Solicitar Más Conceptos
              </Button>
            )}
          </div>
          {creativeConcepts.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold">Conceptos Generados:</h3>
              {creativeConcepts.map((concept, index) => (
                <Card key={concept.id}>
                  <CardHeader><CardTitle>Concepto {index + 1}</CardTitle></CardHeader>
                  <CardContent>
                    {concept.isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`concept-${concept.id}`}>Concepto</Label>
                          <Textarea id={`concept-${concept.id}`} value={concept.concept} onChange={(e) => handleConceptChange(concept.id, 'concept', e.target.value)} rows={3} />
                        </div>
                        <div>
                          <Label htmlFor={`copyOut-${concept.id}`}>Copy Out</Label>
                          <Textarea id={`copyOut-${concept.id}`} value={concept.copyOut} onChange={(e) => handleConceptChange(concept.id, 'copyOut', e.target.value)} rows={2} />
                        </div>
                        <div>
                          <Label htmlFor={`copyIn-${concept.id}`}>Copy In</Label>
                          <Textarea id={`copyIn-${concept.id}`} value={concept.copyIn} onChange={(e) => handleConceptChange(concept.id, 'copyIn', e.target.value)} rows={2} />
                        </div>
                        <div>
                          <Label htmlFor={`cta-${concept.id}`}>CTA</Label>
                          <Input id={`cta-${concept.id}`} value={concept.cta} onChange={(e) => handleConceptChange(concept.id, 'cta', e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor={`feedback-${concept.id}`}>Feedback para IA</Label>
                          <Textarea id={`feedback-${concept.id}`} value={concept.feedback} onChange={(e) => handleConceptChange(concept.id, 'feedback', e.target.value)} placeholder="Ayuda a la IA a mejorar..." rows={2} />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => handleSaveConcept(concept.id)}>Guardar</Button>
                          <Button variant="outline" onClick={() => handleCancelEdit(concept.id)}>Cancelar</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p><strong>Concepto:</strong> {concept.concept}</p>
                        <p><strong>Copy Out:</strong> {concept.copyOut}</p>
                        <p><strong>Copy In:</strong> {concept.copyIn}</p>
                        <p><strong>CTA:</strong> {concept.cta}</p>
                        {concept.feedback && <p><strong>Feedback:</strong> {concept.feedback}</p>}
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" onClick={() => handleEditConcept(concept.id)}>Editar</Button>
                          <Button variant="destructive" onClick={() => handleDeleteConcept(concept.id)}>Borrar</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
