'use client';

import { useActionState } from 'react';
import { saveProduct } from '../actions';
import { Field, FormMessage, SubmitButton, inputClass } from './form-parts';

export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  category: 'PIMENTA' | 'MOLHO' | 'KIT';
  price: string;
  originalPrice: string;
  imageUrl: string;
  tag: string;
  sauceType: string;
  heatLevel: string;
  weightGrams: string;
  heightCm: string;
  widthCm: string;
  lengthCm: string;
  active: boolean;
}

export const emptyProduct: ProductFormValues = {
  name: '',
  description: '',
  category: 'MOLHO',
  price: '',
  originalPrice: '',
  imageUrl: '',
  tag: '',
  sauceType: '',
  heatLevel: '',
  weightGrams: '400',
  heightCm: '10',
  widthCm: '7',
  lengthCm: '7',
  active: true,
};

export default function ProductForm({ values }: { values: ProductFormValues }) {
  const [state, action] = useActionState(saveProduct, null);
  const isNew = !values.id;

  return (
    <form action={action} className="space-y-8">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <section className="bg-white shadow-sm rounded p-6 space-y-4">
        <h2 className="font-bold text-lg">Sobre o produto</h2>
        <Field label="Nome do produto">
          <input name="name" defaultValue={values.name} required maxLength={100} className={inputClass} placeholder="Ex.: Pimenta Jalapeño" />
        </Field>
        <Field label="Descrição" hint="Aparece na página do produto. Conte o sabor, a ardência e como usar.">
          <textarea name="description" defaultValue={values.description} required rows={4} maxLength={2000} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <select name="category" defaultValue={values.category} className={inputClass}>
              <option value="MOLHO">Molho</option>
              <option value="PIMENTA">Pimenta</option>
              <option value="KIT">Kit</option>
            </select>
          </Field>
          <Field label="Etiqueta de destaque (opcional)" hint='Ex.: "Mais Vendida", "Novo".'>
            <input name="tag" defaultValue={values.tag} maxLength={30} className={inputClass} />
          </Field>
          <Field label="Ardência de 1 a 5 (só pimentas)" hint="Deixe em branco para molhos e kits.">
            <input name="heatLevel" defaultValue={values.heatLevel} inputMode="numeric" className={inputClass} />
          </Field>
          <Field label="Estilo do molho (opcional)" hint='Ex.: "Clássico", "Defumado".'>
            <input name="sauceType" defaultValue={values.sauceType} maxLength={40} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded p-6 space-y-4">
        <h2 className="font-bold text-lg">Preço</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preço de venda (R$)">
            <input name="price" defaultValue={values.price} required inputMode="decimal" className={inputClass} placeholder="28,90" />
          </Field>
          <Field label="Preço antigo (opcional)" hint="Só preencha em promoção: o valor de antes, maior que o preço de venda.">
            <input name="originalPrice" defaultValue={values.originalPrice} inputMode="decimal" className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded p-6 space-y-4">
        <h2 className="font-bold text-lg">Embalagem e frete</h2>
        <p className="text-sm text-pitch/70">O frete é calculado com esses valores, então meça a caixa ou o frasco já embalado.</p>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Field label="Peso (gramas)">
            <input name="weightGrams" defaultValue={values.weightGrams} required inputMode="numeric" className={inputClass} />
          </Field>
          <Field label="Altura (cm)">
            <input name="heightCm" defaultValue={values.heightCm} required inputMode="numeric" className={inputClass} />
          </Field>
          <Field label="Largura (cm)">
            <input name="widthCm" defaultValue={values.widthCm} required inputMode="numeric" className={inputClass} />
          </Field>
          <Field label="Comprimento (cm)">
            <input name="lengthCm" defaultValue={values.lengthCm} required inputMode="numeric" className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="bg-white shadow-sm rounded p-6 space-y-4">
        <h2 className="font-bold text-lg">Foto e vitrine</h2>
        <Field label="Link da foto (opcional)" hint="Endereço da imagem, começando com / (arquivo do site) ou https://. Produtos com fotos já cadastradas no site usam essas fotos automaticamente.">
          <input name="imageUrl" defaultValue={values.imageUrl} className={inputClass} placeholder="https://..." />
        </Field>
        {isNew && (
          <Field label="Quantidade em estoque agora" hint="Quantas unidades você já tem prontas para vender.">
            <input name="initialStock" defaultValue="0" inputMode="numeric" className={inputClass} />
          </Field>
        )}
        <label className="flex items-center gap-3 text-base font-medium">
          <input type="checkbox" name="active" defaultChecked={values.active} className="h-5 w-5 accent-brand" />
          Mostrar este produto no site
        </label>
      </section>

      <FormMessage state={state} />
      <SubmitButton>{isNew ? 'Cadastrar produto' : 'Salvar alterações'}</SubmitButton>
    </form>
  );
}
